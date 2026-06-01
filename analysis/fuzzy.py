import numpy as np
import skfuzzy as fuzz
import matplotlib.pyplot as plt
from skfuzzy import control as ctrl
import pandas as pd

from linear_regression import gerar_regras


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
rendimento['alto'] = fuzz.trapmf(rendimento.universe, [7, 8.5, 10, 10])
#rendimento['muito_alto'] = fuzz.trapmf(rendimento.universe, [9, 9.5, 10, 10])

#chamada da regressao linear
set_regras = gerar_regras()

regras = []

for r in set_regras:
    regra = ctrl.Rule(q18[r['q18']] & q19[r['q19']], rendimento[r['rendimento']])

    regras.append(regra)

    print( f"{r['q18']} + " f"{r['q19']} " f"→ {r['rendimento']} " f"({r['nota_prevista']:.2f})" )


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


