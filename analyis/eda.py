import pandas as pd
#from ydata_profiling import ProfileReport
from gera_grafico import gera_grafico

df = pd.read_csv('./files.csv/notas_fmcc.csv')

media = df['grade'].mean()

def S_dp(df):
    #calcular o desvio padrao amostral (S) 
    for row in df.itertuples():
        return (((row.grade - media)**2).sum() / (len(df) - 1))**0.5


def e_dp(df):
    S = S_dp(df)
    #utilizando uma distribuição normal padrao para um intervalo de confiança de 95%
    normal_padrao = 1.96
    n = len(df)
    return S * normal_padrao / (n**0.5)

erro = e_dp(df)

ic_inf = media - erro
ic_sup = media + erro

#profile = ProfileReport(df, title="Relatório de Análise Exploratória de Dados", explorative=True)
#profile.to_file("relatorio_eda.html")

#print(f"Desvio Padrão Amostral (S): {S_dp(df)}")
#print(f"Erro Padrão (e): {e_dp(df)}")
#print(f"Intervalo de Confiança (95%): {ic_inf} a {ic_sup}")

gera_grafico(media, ic_inf, ic_sup, "grade")