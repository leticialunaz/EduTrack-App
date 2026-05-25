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

def label_rendimento(x):
    if x < 4:
        return 'baixo'
    elif x < 7:
        return 'medio'
    elif x < 9:
        return 'alto'
    else:
        return 'muito_alto'

df['q18_label'] = df['q18'].apply(label_likert)
df['q19_label'] = df['q19'].apply(label_likert)
df['r_label'] = df['media_final'].apply(label_rendimento)

q18 = ctrl.Antecedent(np.arange(1, 6, 1), 'q18')
q19 = ctrl.Antecedent(np.arange(1, 6, 1), 'q19')
r = ctrl.Consequent(np.arange(0, 10.1, 0.1), 'r')

labels_in = ['discordancia', 'neutro', 'concordancia']
labels_out = ['baixo', 'medio', 'alto', 'muito_alto']

q18['discordancia'] = fuzz.trapmf(q18.universe, [1,1,2,2])
q18['neutro'] = fuzz.trimf(q18.universe, [2,3,4])
q18['concordancia'] = fuzz.trapmf(q18.universe, [4,4,5,5])

q19['discordancia'] = fuzz.trapmf(q19.universe, [1,1,2,2])
q19['neutro'] = fuzz.trimf(q19.universe, [2,3,4])
q19['concordancia'] = fuzz.trapmf(q19.universe, [4,4,5,5])

r['baixo'] = fuzz.trimf(r.universe, [0,2,4])
r['medio'] = fuzz.trimf(r.universe, [3,5.5,7])
r['alto'] = fuzz.trimf(r.universe, [6,8,9])
r['muito_alto'] = fuzz.trimf(r.universe, [8.5,9.5,10])

rule_base = {}

def best_label(var, value, sets):
    best = None
    best_val = -1
    for s in sets:
        val = fuzz.interp_membership(var.universe, var[s].mf, value)
        if val > best_val:
            best_val = val
            best = s
    return best, best_val

for _, row in df.iterrows():

    q18_lab, q18_mu = best_label(q18, row['q18'], labels_in)
    q19_lab, q19_mu = best_label(q19, row['q19'], labels_in)
    r_lab, r_mu = best_label(r, row['media_final'], labels_out)

    rule = (q18_lab, q19_lab)

    strength = q18_mu * q19_mu * r_mu

    if rule not in rule_base or strength > rule_base[rule][1]:
        rule_base[rule] = (r_lab, strength)


rules = []

for (q18_lab, q19_lab), (r_lab, strength) in rule_base.items():

    rules.append(
        ctrl.Rule(
            q18[q18_lab] & q19[q19_lab],
            r[r_lab]
        )
    )

    print(f"{q18_lab}, {q19_lab} → {r_lab} | força={strength:.3f}")

system = ctrl.ControlSystem(rules)
sistema = ctrl.ControlSystemSimulation(system)


# sistema = input['q18'] = 5
# sistema.input['q19'] = 2

# sistema.compute()

# print("\nRESULTADO:", sim.output['r'])

# if sistema.output['r'] < 4:
#     print("baixo")
# elif sistema.output['r'] < 7:
#     print("medio")
# elif sistema.output['r'] < 9:
#     print("alto")
# else:
#     print("muito_alto")