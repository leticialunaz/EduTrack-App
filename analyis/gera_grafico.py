import matplotlib.pyplot as plt
import pandas as pd


def gera_grafico(intervalos):

    dados = []

    for disciplina, valores in intervalos.items():

        media, ic_inf, ic_sup = valores

        dados.append({
            "disciplina": disciplina,
            "media": media,
            "ic_inf": ic_inf,
            "ic_sup": ic_sup
        })

    df = pd.DataFrame(dados)

    # ordena pela média
    df = df.sort_values(by="media")

    plt.figure(figsize=(14, 25))

    plt.errorbar(
        x=df["media"],
        y=range(len(df)),
        xerr=[
            df["media"] - df["ic_inf"],
            df["ic_sup"] - df["media"]
        ],
        fmt='o',
        capsize=4
    )

    plt.yticks(
        range(len(df)),
        df["disciplina"]
    )

    plt.xlabel("Média das notas")

    plt.title(
        "Média e Intervalo de Confiança (95%)"
    )

    plt.grid(True)

    plt.tight_layout()

    plt.show()