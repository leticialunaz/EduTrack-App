import numpy as np
import skfuzzy as fuzz
import matplotlib.pyplot as plt
from skfuzzy import control as ctrl
import pandas as pd
from apyori import apriori


df = pd.read_csv('./files/respostas_notas.csv')

#teste para tópico de carreira
q18 = ctrl.Antecedent(np.arange(1, 6, 1), 'q18') 
q19 = ctrl.Antecedent(np.arange(1, 6, 1), 'q19')

rendimento = ctrl.Consequent(np.arange(0, 10.1, 0.1), 'rendimento')

# fuzzy_sets
q18['discordancia'] = fuzz.trapmf(q18.universe, [1, 1, 2, 2])
q18['neutro'] = fuzz.trimf(q18.universe, [2, 3, 4])
q18['concordancia'] = fuzz.trapmf(q18.universe, [4, 4, 5, 5])

q19['discordancia'] = fuzz.trapmf(q19.universe, [1, 1, 1, 2])
q19['neutro'] = fuzz.trimf(q19.universe, [2, 3, 4])
q19['concordancia'] = fuzz.trapmf(q19.universe, [4, 4, 5, 5])

rendimento['baixo'] = fuzz.trapmf(rendimento.universe, [0, 0, 2, 4])
rendimento['medio'] = fuzz.trimf(rendimento.universe, [4, 5.5, 7])
rendimento['alto'] = fuzz.trimf(rendimento.universe, [7, 8, 9])
rendimento['muito_alto'] = fuzz.trapmf(rendimento.universe, [9, 9.5, 10, 10])

#garantia de pertinencia dos dados de entrada
def garantir_pertinencia(valor):
    for valor in range(1, 6):
        pert_discordancia = fuzz.interp_membership(q18.universe, q18['discordancia'].mf, valor)
        pert_neutro = fuzz.interp_membership(q18.universe, q18['neutro'].mf, valor)
        pert_concordancia = fuzz.interp_membership(q18.universe, q18['concordancia'].mf, valor)
    
        print(f"Valor de entrada: {valor}")
        print(f"  - Discordância: {pert_discordancia:.2f}")
        print(f"  - Neutro:       {pert_neutro:.2f}")
        print(f"  - Concordância: {pert_concordancia:.2f}")


#definindo os labels para as respostas e notas
def label_likert(valor):

    if valor <= 2:
        return 'discordancia'

    elif valor == 3:
        return 'neutro'

    else:
        return 'concordancia'
    
df['q18_label'] = df['q18'].apply(label_likert)
df['q19_label'] = df['q19'].apply(label_likert)



def label_rendimento(nota):

    pertinencias = {
        'baixo': fuzz.interp_membership(
            rendimento.universe,
            rendimento['baixo'].mf,
            nota
        ),

        'medio': fuzz.interp_membership(
            rendimento.universe,
            rendimento['medio'].mf,
            nota
        ),

        'alto': fuzz.interp_membership(
            rendimento.universe,
            rendimento['alto'].mf,
            nota
        ),

        'muito_alto': fuzz.interp_membership(
            rendimento.universe,
            rendimento['muito_alto'].mf,
            nota
        )
    }

    return max(pertinencias, key=pertinencias.get)

df['rendimento_label'] = df['media_final'].apply(label_rendimento)
df_regras = df[['q18_label', 'q19_label', 'rendimento_label']]



#transformando os dados em formatos de regras
transacoes = []

for _, linha in df_regras.iterrows():

    transacao = [
        f"q18_{linha['q18_label']}",
        f"q19_{linha['q19_label']}",
        f"rendimento_{linha['rendimento_label']}"
    ]

    transacoes.append(transacao)


#uso do modelo apriori para extrair regras de associação

regras = []

combinacoes = [
    ('discordancia', 'discordancia'),
    ('discordancia', 'neutro'),
    ('discordancia', 'concordancia'),

    ('neutro', 'discordancia'),
    ('neutro', 'neutro'),
    ('neutro', 'concordancia'),

    ('concordancia', 'discordancia'),
    ('concordancia', 'neutro'),
    ('concordancia', 'concordancia')
]

for q18_valor, q19_valor in combinacoes:

    # filtra apenas os alunos da combinação atual
    filtro = df[
        (df['q18_label'] == q18_valor) &
        (df['q19_label'] == q19_valor)
    ]

    # conta quantas vezes cada rendimento aparece
    frequencias = filtro['rendimento_label'].value_counts()

    # verifica se encontrou alunos nessa combinação
    if len(frequencias) > 0:

        # pega o rendimento mais frequente
        rendimento_dominante = frequencias.idxmax()

         # cria o objeto ctrl.Rule REAL
        regra = ctrl.Rule(
            q18[q18_valor] & q19[q19_valor],
            rendimento[rendimento_dominante]
        )

        regras.append(regra)


#sistema final de inferência

sistema_ctrl = ctrl.ControlSystem(regras)

sistema = ctrl.ControlSystemSimulation(sistema_ctrl)

sistema.input['q18'] = 5
sistema.input['q19'] = 1

sistema.compute()
result = sistema.output['rendimento']

print(result)
if(result < 4): print("baixo")
elif(result < 7): print("medio")
elif(result < 9): print("alto")
else: print("muito alto")


