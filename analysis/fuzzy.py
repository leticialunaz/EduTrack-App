import numpy as np
import skfuzzy as fuzz
from skfuzzy import control as ctrl

#teste para tópico de carreira
q18 = ctrl.Antecedent(np.arange(1, 5.1, 0.1), 'q18')
q19 = ctrl.Antecedent(np.arange(1, 5.1, 0.1), 'q19')

rendimento = ctrl.Consequent(np.arange(0, 10.1, 0.1), 'rendimento')


q18['discordancia'] = fuzz.trapmf(q18.universe, [1, 1, 1.5, 2])
q18['neutro'] = fuzz.trimf(q18.universe, [2, 3, 4])
q18['concordancia'] = fuzz.trapmf(q18.universe, [4, 4.5, 5, 5])

q19['discordancia'] = fuzz.trapmf(q19.universe, [1, 1, 1.5, 2])
q19['neutro'] = fuzz.trimf(q19.universe, [2, 3, 4])
q19['concordancia'] = fuzz.trapmf(q19.universe, [4, 4.5, 5, 5])

rendimento['baixo'] = fuzz.trapmf(rendimento.universe, [0, 0, 2, 4])
rendimento['medio'] = fuzz.trimf(rendimento.universe, [4, 5.5, 7])
rendimento['alto'] = fuzz.trimf(rendimento.universe, [7, 8, 9])
rendimento['muito_alto'] = fuzz.trapmf(rendimento.universe, [9, 9.5, 10, 10])


regra1 = ctrl.Rule(
    q18['concordancia'] & q19['concordancia'], rendimento['medio']
)


regra2 = ctrl.Rule(
    q18['concordancia'] & q19['discordancia'], rendimento['baixo']
)


regra3 = ctrl.Rule(
    q18['concordancia'] & q19['neutro'], rendimento['baixo']
)


regra4 = ctrl.Rule(
    q18['discordancia'] & q19['discordancia'], rendimento['baixo']
)

regra5 = ctrl.Rule(
    q18['discordancia'] & q19['concordancia'], rendimento['muito_alto']
)

regra6 = ctrl.Rule(
    q18['discordancia'] & q19['neutro'], rendimento['alto']
)

regra7 = ctrl.Rule(
    q18['neutro'] & q19['neutro'], rendimento['medio']
)

regra8 = ctrl.Rule(
    q18['neutro'] & q19['discordancia'], rendimento['medio']
)

regra9 = ctrl.Rule(
    q18['neutro'] & q19['concordancia'], rendimento['alto']
)


sistema_ctrl = ctrl.ControlSystem([
    regra1, regra2, regra3, 
    regra4, regra5, regra6, 
    regra7, regra8, regra9
])