import statsmodels.formula.api as smf
import numpy as np
import pandas as pd
from scipy.stats import spearmanr
from sklearn.preprocessing import MinMaxScaler
import sys
import matplotlib.pyplot as plt
import scipy.stats as stats

def computaModelo(itens_sel, df_topico):
	
	y = df_topico['media_final']
	df_topico = df_topico.drop(columns=["media_final", "name"])

	df = pd.DataFrame()

	df['indice_global'] = df_topico[itens_sel].mean(axis=1)

	rho, p = spearmanr(df['indice_global'], y)

	df['media_final'] = y

	modelo = smf.ols("indice_global ~ media_final", data=df).fit()

	# Extrair coeficientes
	beta_0 = modelo.params['Intercept']
	beta_1 = modelo.params['media_final']

	#print(f"\nbeta_0 (intercepto): {beta_0:.4f}")
	#print(f"beta_1 (peso do escore): {beta_1:.4f}")

	return beta_0, beta_1
######################
def gerar_feedback(df_aluno_row, itens, beta_0, beta_1, top_n=3, nomes_itens=None):
    """
    Gera feedback para um aluno.

    Parâmetros:
    - df_aluno_row: linha do DataFrame referente ao aluno
    - itens: lista de colunas Likert
    - beta_0, beta_1: coeficientes do modelo linear
    - top_n: quantos comportamentos recomendar
    - nomes_itens: dicionário {coluna: nome legível} (opcional)
    """

    if nomes_itens is None:
        nomes_itens = {item: item for item in itens}

    # Nota atual estimada pelo modelo
    escore_atual = df_aluno_row[itens].mean()
    nota_estimada_atual = beta_0 + beta_1 * escore_atual

    # Nota estimada se a média subir ao máximo (5)
    nota_estimada_max = beta_0 + beta_1 * 5

    # Ganho total possível
    ganho_total = nota_estimada_max - nota_estimada_atual

    # Gap por item (quanto cada item está abaixo do máximo)
    gaps = {}
    for item in itens:
        valor_atual = df_aluno_row[item]
        gap = 5 - valor_atual
        if gap > 0:
            # Estimativa de quanto a nota sobe se esse item for de valor_atual para 5
            # Cada item tem peso 1/n na média
            contribuicao = (gap / len(itens)) * beta_1
            gaps[item] = {
                'valor_atual': valor_atual,
                'gap': gap,
                'ganho_estimado': contribuicao
            }

    # Ranquear pelos itens com maior gap (mais abaixo do máximo)
    gaps_ordenados = sorted(gaps.items(), key=lambda x: x[1]['gap'], reverse=True)

    # Montar resultado
    resultado = {
        'escore_atual': round(escore_atual, 2),
        'nota_estimada': round(nota_estimada_atual, 2),
        'ganho_total_possivel': round(ganho_total, 2),
        'recomendacoes': []
    }

    for item, info in gaps_ordenados[:top_n]:
        resultado['recomendacoes'].append({
            'comportamento': nomes_itens[item],
            'valor_atual': int(info['valor_atual']),
            'ganho_estimado': round(info['ganho_estimado'], 2)
        })

    return resultado
######################
def texto_feedback(resultado):
    texto  = f"Seu escore médio de comportamentos é {resultado['escore_atual']} de 5.\n"
    texto += f"Sua nota estimada pelo modelo é {resultado['nota_estimada']:.1f}.\n"
    texto += f"Seu potencial de melhora estimado é de até +{resultado['ganho_total_possivel']:.1f} pontos na nota média.\n\n"
    texto += "Os comportamentos onde você tem mais espaço para crescer são:\n\n"

    for i, rec in enumerate(resultado['recomendacoes'], start=1):
        texto += f"{i}. {rec['comportamento']}\n"
        texto += f"   Nível atual: {rec['valor_atual']} de 5\n"
        texto += f"   Potencial de contribuição na nota: {rec['ganho_estimado']:.2f} pontos\n\n"

    texto += "Foque em melhorar um comportamento de cada vez — pequenas mudanças consistentes tendem a ter mais efeito do que grandes mudanças pontuais."

    return texto
##########################
def calcular_ganho_atributo(valor_atual, beta):
    """
    Calcula o ganho potencial na nota e a recomendação para um atributo.

    valor_atual : valor atual do aluno na escala Likert (1–5)
    beta        : coeficiente do atributo no modelo
    """
    if beta > 0:
        delta = 5 - valor_atual
        if delta <= 0:
            return 0, "Você já está no máximo recomendado (5)."
        ganho = beta * delta
        recomendacao = "Aumentar esse comportamento até 5."

    elif beta < 0:
        delta = valor_atual - 1
        if delta <= 0:
            return 0, "Você já está no mínimo recomendado (1)."
        ganho = abs(beta) * delta
        recomendacao = "Reduzir esse comportamento até 1."

    else:
        ganho = 0
        recomendacao = "Neste modelo, esse comportamento quase não influencia a nota."

    return round(ganho, 2), recomendacao

#########################################################
def gerar_feedback_multiplo(df_aluno_row,
                             atrib1, atrib2,
                             beta_0, beta_1, beta_2,
                             nome_atrib1='Atributo 1',
                             nome_atrib2='Atributo 2'):
    """
    Gera o dicionário de feedback para um aluno com base em
    regressão múltipla com dois atributos Likert (1–5).

    df_aluno_row : linha do DataFrame referente ao aluno
    atrib1, atrib2 : nomes das colunas dos atributos
    beta_0, beta_1, beta_2 : coeficientes do modelo
    nome_atrib1, nome_atrib2 : rótulos legíveis dos atributos
    """
    valor_1 = df_aluno_row[atrib1]
    valor_2 = df_aluno_row[atrib2]

    nota_atual = beta_0 + beta_1 * valor_1 + beta_2 * valor_2

    ganho_1, recomendacao_1 = calcular_ganho_atributo(valor_1, beta_1)
    ganho_2, recomendacao_2 = calcular_ganho_atributo(valor_2, beta_2)

    ganho_total = ganho_1 + ganho_2

    return {
        'nota_estimada': round(nota_atual, 2),
        'ganho_total_possivel': round(ganho_total, 2),
        'atributos': [
            {
                'nome': nome_atrib1,
                'valor_atual': int(valor_1),
                'coeficiente': round(beta_1, 3),
                'ganho_potencial': ganho_1,
                'recomendacao': recomendacao_1
            },
            {
                'nome': nome_atrib2,
                'valor_atual': int(valor_2),
                'coeficiente': round(beta_2, 3),
                'ganho_potencial': ganho_2,
                'recomendacao': recomendacao_2
            }
        ]
    }

##################################
def texto_feedback_multiplo(resultado):
    """
    Converte o dicionário de feedback em texto legível para o aluno.
    """
    texto  = f"Sua nota estimada pelo modelo é {resultado['nota_estimada']:.1f}.\n"
    texto += f"Se você ajustar seus comportamentos na direção recomendada, "
    texto += f"o ganho potencial estimado é de até +{resultado['ganho_total_possivel']:.1f} pontos.\n\n"
    texto += "Veja cada comportamento:\n\n"

    atributos = sorted(resultado['atributos'],
                       key=lambda x: x['ganho_potencial'],
                       reverse=True)

    for i, a in enumerate(atributos, start=1):
        texto += f"{i}. {a['nome']}\n"
        texto += f"   Nível atual na escala (1 a 5): {a['valor_atual']}\n"
        texto += f"   Coeficiente no modelo: {a['coeficiente']:.2f}\n"
        texto += f"   Recomenda-se: {a['recomendacao']}\n"

        if a['ganho_potencial'] > 0:
            texto += f"   Ganho potencial estimado na nota: +{a['ganho_potencial']:.2f} ponto(s).\n\n"
        else:
            texto += f"   Nenhum ganho adicional estimado ao alterar esse comportamento.\n\n"

    texto += "Use essas recomendações como orientação: elas vêm de padrões observados em vários alunos.\n"
    texto += "Comece pelo comportamento com maior ganho potencial e avance aos poucos."

    return texto
###########################
linha_do_aluno = int(sys.argv[1])

listDeAtributosSelecionados =  ['q18', 'q19']
df_topico = pd.read_csv('topico_carreira.csv')
df_notas = pd.read_csv('medias_cra.csv')
df_original = pd.merge(df_topico, df_notas, on="name")

#listDeAtributosSelecionados = ['q54', 'q65']
#df_original = pd.read_csv('topico_estudo_notas.csv')

scaler = MinMaxScaler(feature_range=(1, 5))
df_original['media_final'] = scaler.fit_transform(df_original['media_final'].values.reshape(-1, 1))

df_topico = df_original.copy()
'''
beta_0, beta_1 = computaModelo(listDeAtributosSelecionados, df_topico)
print("beta_0: ", beta_0, ", beta_1: ", beta_1)
df_aluno_row = df_original.iloc[linha_do_aluno] 
resultado = gerar_feedback(df_aluno_row, listDeAtributosSelecionados, beta_0, beta_1, top_n=3, nomes_itens=None)
print("resultado: ", resultado)
texto = texto_feedback(resultado)
'''

# df: DataFrame com colunas 'atrib1', 'atrib2' e 'alvo'
modelo = smf.ols("media_final ~ q18 + q19", data=df_original[['media_final','q18', 'q19']]).fit()
print(modelo.summary())

'''
### avalia qualidade do modelo
plt.hist(modelo.resid, bins=20, edgecolor='black')
plt.title("Distribuição dos resíduos")
plt.show()
# Teste formal de normalidade
stat, p = stats.shapiro(modelo.resid)
print(f"Shapiro-Wilk: stat={stat:.4f}, p={p:.4f}")
residuos = modelo.resid
y_pred   = modelo.fittedvalues
plt.scatter(y_pred, residuos, alpha=0.6)
plt.axhline(0, color='red', linestyle='--')
plt.xlabel("Valores preditos")
plt.ylabel("Resíduos")
plt.title("Resíduos vs. Preditos")
plt.show()
###### até aqui
'''

beta_0 = modelo.params['Intercept']
beta_1 = modelo.params['q18']
beta_2 = modelo.params['q19']
df_aluno_row = df_original.iloc[linha_do_aluno] 
resultado = gerar_feedback_multiplo(df_aluno_row,
                             'q18', 'q19',
                             beta_0, beta_1, beta_2,
                             nome_atrib1='Q18 - Não sinto uma correspondência entre o meu nível de investimento e os resultados acadêmicos obtidos.',
                             nome_atrib2='Q19 - Consigo habitualmente atingir os objetivos acadêmicos a que me proponho.')
texto = texto_feedback_multiplo(resultado)

print("Feedback \n", texto)
print("nota real: ", df_aluno_row['media_final'])
print(df_original.iloc[0]['name'])

