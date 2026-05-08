#CORRELAÇÃO ENTRE OS TÓPICOS E AS NOTAS INDIVIDUAIS DOS ALUNOS NAS DISCIPLINAS
import pandas as pd
import matplotlib.pyplot as plt

#df_topico1 = pd.read_csv('./files/topico_carreira.csv')
#df_topico2 = pd.read_csv('./files/topico_estudo.csv')
#df_topico3 = pd.read_csv('./files/topico_institucional.csv')    
#df_topico4 = pd.read_csv('./files/topico_interpessoal.csv')
df_topico5 = pd.read_csv('./files/topico_pessoal.csv')


df_notas_disciplinas = pd.read_csv('./files/notasNome_x_disciplina.csv')

#merge pelo nome
df = pd.merge(df_topico5, df_notas_disciplinas, left_on='name', right_on='aluno')
#disciplina = 'FUNDAMENTOS DE MATEMÁTICA PARA CIÊNCIA DA COMPUTAÇÃO I' 
#disciplina = 'CÁLCULO DIFERENCIAL E INTEGRAL II'


#df = df.dropna(subset=[disciplina])

perguntas = [
    col for col in df_topico5.columns if col != 'name'
]

disciplinas = [
    col for col in df_notas_disciplinas.columns if col != 'aluno'
]

resultados = []

for disciplina in disciplinas:
    df_disc = df.dropna(subset=[disciplina])
    if len(df_disc) < 30:
        continue

    correlacao = (df_disc[perguntas].corrwith(df_disc[disciplina], method='spearman')).sort_values()
    #for pergunta, valor in correlacao.items():
    #   resultados.append({
    #    'disciplina': disciplina,
    #    'pergunta': pergunta,   
    #    'correlacao': valor,
    #    'n_alunos': len(df_disc)
    #    })  
    #    print(f"Disciplina: {disciplina}, Pergunta: {pergunta}, Correlação: {valor}")
    pergunta_pos = correlacao.idxmax()
    valor_pos = correlacao.max()
    pergunta_neg = correlacao.idxmin()
    valor_neg = correlacao.min()
    resultados.append({
        'disciplina': disciplina,
        'pergunta_pos': pergunta_pos,
        'correlacao_pos': valor_pos,
        'pergunta_neg': pergunta_neg,
        'correlacao_neg': valor_neg,
        'n_alunos': len(df_disc)
    })
df_resultados = pd.DataFrame(resultados)
#print(df_resultados)


df_plot = df_resultados.sort_values(
    by='correlacao_pos'
)

df_plot = df_resultados.sort_values(
    by='correlacao_pos'
)

plt.figure(figsize=(14, 12))

# positivas
plt.barh(
    df_plot['disciplina'],
    df_plot['correlacao_pos'],
    label='Maior positiva'
)

# negativas
plt.barh(
    df_plot['disciplina'],
    df_plot['correlacao_neg'],
    label='Maior negativa'
)

# textos
for i, row in df_plot.iterrows():

    plt.text(
        row['correlacao_pos'],
        row['disciplina'],
        f"{row['pergunta_pos']} ({row['correlacao_pos']:.2f})",
        va='center'
    )

    plt.text(
        row['correlacao_neg'],
        row['disciplina'],
        f"{row['pergunta_neg']} ({row['correlacao_neg']:.2f})",
        va='center'
    )

plt.xlabel('Correlação')
plt.ylabel('Disciplina')

plt.title(
    'Maiores correlações positivas e negativas por disciplina com o tópico pessoal'
)

plt.axvline(0)

plt.legend()

plt.grid(True)

plt.tight_layout()


plt.savefig(
    './files/correlacao_pessoal_nota_disc.png')