import matplotlib.pyplot as plt


def gera_grafico(media, ic_inf, ic_sup, nome_variavel="Média"):
    plt.figure(figsize=(6, 3))

    plt.errorbar(
        x=[1],
        y=[media],
        yerr=[[media - ic_inf], [ic_sup - media]],
        fmt='o',
        capsize=8
    )

    plt.xticks([1], [nome_variavel])
    plt.ylabel("Valor")
    plt.title("Intervalo de Confiança (95%)")

    plt.grid(True)

    plt.show()