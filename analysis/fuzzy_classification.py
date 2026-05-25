import numpy as np
import pandas as pd
import skfuzzy as fuzz
from skfuzzy import control as ctrl

df = pd.read_csv('./files/respostas_notas.csv')


def label_likert(x):
    if x <= 2:
        return 'discordancia'
    elif x == 3:
        return 'neutro'
    else:
        return 'concordancia'


df['q18_label'] = df['q18'].apply(label_likert)
df['q19_label'] = df['q19'].apply(label_likert)

def classificar_rendimento(x):
    if x < 4:
        return "baixo"
    elif x < 7:
        return "medio"
    elif x < 9:
        return "alto"
    else:
        return "muito_alto"

df['rendimento_label'] = df['media_final'].apply(classificar_rendimento)


q18 = ctrl.Antecedent(np.arange(1, 6, 1), 'q18')
q19 = ctrl.Antecedent(np.arange(1, 6, 1), 'q19')

rendimento = ctrl.Consequent(np.arange(0, 10.1, 0.1), 'rendimento')

labels = ['discordancia', 'neutro', 'concordancia']

q18['discordancia'] = fuzz.trapmf(q18.universe, [1,1,2,2])
q18['neutro'] = fuzz.trimf(q18.universe, [2,3,4])
q18['concordancia'] = fuzz.trapmf(q18.universe, [4,4,5,5])

q19['discordancia'] = fuzz.trapmf(q19.universe, [1,1,2,2])
q19['neutro'] = fuzz.trimf(q19.universe, [2,3,4])
q19['concordancia'] = fuzz.trapmf(q19.universe, [4,4,5,5])

rendimento['baixo'] = fuzz.trimf(rendimento.universe, [0, 2, 4])
rendimento['medio'] = fuzz.trimf(rendimento.universe, [3, 5.5, 7])
rendimento['alto'] = fuzz.trimf(rendimento.universe, [6, 8, 9])
rendimento['muito_alto'] = fuzz.trimf(rendimento.universe, [8.5, 9.5, 10])

regras = []

for a in labels:
    for b in labels:

        subset = df[(df['q18_label'] == a) & (df['q19_label'] == b)]

        if len(subset) == 0:
            continue
        suporte = len(subset) / len(df)

        # classe dominante
        classe = subset['rendimento_label'].value_counts().idxmax()

        regra = ctrl.Rule(
                q18[a] & q19[b],
                rendimento[classe]
            )
        regra.weight = suporte

        regras.append(regra)

        print(f"{a}, {b} → {classe} | suporte={suporte:.3f}")


system = ctrl.ControlSystem(regras)
sim = ctrl.ControlSystemSimulation(system)


sim.input['q18'] = 1
sim.input['q19'] = 5

sim.compute()

print("\nRESULTADO:", sim.output['rendimento'])

if sim.output['rendimento'] < 4:
    print("baixo")
elif sim.output['rendimento'] < 7:
    print("medio")
elif sim.output['rendimento'] < 9:
    print("alto")
else:
    print("muito_alto")