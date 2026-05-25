import numpy as np
import skfuzzy as fuzz
import matplotlib.pyplot as plt
from skfuzzy import control as ctrl
import pandas as pd


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

#gera regras por meio da pertinencia dos dados de entrada
def pertinencia(df):
    regras = []
    #percorre por aluno
    for _, row in df.iterrows():
        q18_vals = {
        'discordancia': fuzz.interp_membership(q18.universe, q18['discordancia'].mf, row['q18']),
        'neutro': fuzz.interp_membership(q18.universe, q18['neutro'].mf, row['q18']),
        'concordancia': fuzz.interp_membership(q18.universe, q18['concordancia'].mf, row['q18']),
    }

    q19_vals = {
        'discordancia': fuzz.interp_membership(q19.universe, q19['discordancia'].mf, row['q19']),
        'neutro': fuzz.interp_membership(q19.universe, q19['neutro'].mf, row['q19']),
        'concordancia': fuzz.interp_membership(q19.universe, q19['concordancia'].mf, row['q19']),
    }

    #rendimento

    r = row['media_final']

    label_q18 = max(q18_vals, key=q18_vals.get)
    label_q19 = max(q19_vals, key=q19_vals.get)

    for a, va in q18_vals.items():
        for b, vb in q19_vals.items():

            peso = va * vb / (va + vb + 1e-6)

            if peso > 0.1:  

                regras.append({
                    "q18": a,
                    "q19": b,
                    "peso": peso,
                    "rendimento": r
                })


    df_rules = pd.DataFrame(regras)

    resultado = df_rules.groupby(['q18', 'q19']).apply(
        lambda x: x.loc[x['peso'].idxmax()]
    ).reset_index(drop=True)


    lista_regras = []

    for _, r in resultado.iterrows():

        if row['media_final'] > 9:
            out = rendimento['muito_alto']
        elif row['media_final'] > 7:
            out = rendimento['alto']
        elif row['media_final'] > 4:
            out = rendimento['medio']
        else:
            out = rendimento['baixo']

        lista_regras.append(
            ctrl.Rule(
                q18[label_q18] & q19[label_q19],
                out
            )
        )
        
    return lista_regras


#sistema final de inferência

regras = pertinencia(df)

sistema_ctrl = ctrl.ControlSystem(regras)

sistema = ctrl.ControlSystemSimulation(sistema_ctrl)

sistema.input['q18'] = 3
sistema.input['q19'] = 5

sistema.compute()
print(len(regras))
result = sistema.output['rendimento']

print(result)
if(result < 4): print("baixo")
elif(result < 7): print("medio")
elif(result < 9): print("alto")
else: print("muito alto")


