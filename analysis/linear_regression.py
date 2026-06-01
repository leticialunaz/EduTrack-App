import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.metrics import mean_absolute_error
from sklearn.metrics import r2_score

def label_likert(valor): 
    if valor <= 2: 
        return 'discordancia' 
    elif valor == 3: 
        return 'neutro' 
    else: 
        return 'concordancia'

def label_rendimento(x):
    if x < 4:
        return 'baixo'
    elif x < 7:
        return 'medio'
    else:    
         return 'alto'


def gerar_regras():
    df = pd.read_csv('./files/respostas_notas.csv')


    #, 'q51', 'q54', 'q90', 'q92', 'q114', 'q113', 'q140', 'q145'
    X = df[['q18', 'q19']]
    y = df['media_final']


    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.3,
        random_state=42
    )

    model = LinearRegression().fit(X_train, y_train)

    regras = []

    combinacoes = [('discordancia', 2), ('neutro', 3), ('concordancia', 5)]

    for nome_q18, valor_q18 in combinacoes:
        for nome_q19, valor_q19 in combinacoes:
            entrada = pd.DataFrame({
                'q18': [valor_q18],
                'q19': [valor_q19]
            })

            nota_prevista = model.predict(entrada)[0]

            rendimento = label_rendimento(nota_prevista)

            regras.append({
                'q18': nome_q18,
                'q19': nome_q19,
                'rendimento': rendimento,
                'nota_prevista': nota_prevista
            })

    #testes
    pred = model.predict(X_test)



    real = y_test.apply(label_rendimento)


    pred_class = [label_rendimento(x) for x in pred]


    acc = accuracy_score(real, pred_class)

    print("ACURÁCIA:", acc)


    print("\nIntercepto:", model.intercept_)
    print("Coeficientes:", model.coef_)


    mae = mean_absolute_error(y_test, pred)




    print("R2:", r2_score(y_test, pred))

    print("MAE:", mae)

    return regras