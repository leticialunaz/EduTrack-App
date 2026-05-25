import numpy as np
import pandas as pd
import skfuzzy as fuzz
from apyori import apriori
from skfuzzy import control as ctrl


df = pd.read_csv('./files/respostas_notas.csv')


q18 = ctrl.Antecedent(np.arange(1, 6, 1), 'q18')
q19 = ctrl.Antecedent(np.arange(1, 6, 1), 'q19')

q18['discordancia'] = fuzz.trapmf(q18.universe, [1, 1, 2, 2])
q18['neutro'] = fuzz.trimf(q18.universe, [2, 3, 4])
q18['concordancia'] = fuzz.trapmf(q18.universe, [4, 4, 5, 5])

q19['discordancia'] = fuzz.trapmf(q19.universe, [1, 1, 2, 2])
q19['neutro'] = fuzz.trimf(q19.universe, [2, 3, 4])
q19['concordancia'] = fuzz.trapmf(q19.universe, [4, 4, 5, 5])


transactions = []

for _, row in df.iterrows():
    t = []

    for label in ['discordancia', 'neutro', 'concordancia']:
        mu = fuzz.interp_membership(
            q18.universe,
            q18[label].mf,
            row['q18']
        )
        if mu >= 0.5:
            t.append(f"q18_{label}")

    for label in ['discordancia', 'neutro', 'concordancia']:
        mu = fuzz.interp_membership(
            q19.universe,
            q19[label].mf,
            row['q19']
        )
        if mu >= 0.5:
            t.append(f"q19_{label}")


    if row['media_final'] > 9:
        t.append("rendimento_muito_alto")
    elif row['media_final'] > 7:
        t.append("rendimento_alto")
    elif row['media_final'] > 4:
        t.append("rendimento_medio")
    else:
        t.append("rendimento_baixo")

    transactions.append(t)

rules = apriori(
    transactions,
    min_support=0.05,
    min_confidence=0.4,
    min_lift=1.2
)

rules = list(rules)


print("\n regras \n")

for r in rules:
    for stat in r.ordered_statistics:

        base = list(stat.items_base)
        add = list(stat.items_add)

        # só regras que levam ao rendimento
        if any("rendimento" in x for x in add):

            print("SE:", base if base else "∅")
            print("ENTÃO:", add)
            print(f"SUPORTE: {r.support:.3f}")
            print(f"CONFIANÇA: {stat.confidence:.3f}")
            print(f"LIFT: {stat.lift:.3f}")
            print("-----------------------------------")