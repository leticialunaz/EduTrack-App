import pandas as pd
#from ydata_profiling import ProfileReport
from gera_grafico import gera_grafico

df = pd.read_csv('./files.csv/notas_x_disciplina.csv')


#df = pd.read_csv('./files.csv/notas_fmcc.csv')
def S_dp(coluna):
    media = coluna.mean()
    #calcular o desvio padrao amostral (S) 
    return (((coluna - media)**2).sum() / (len(coluna) - 1))**0.5

def e_dp(coluna):
    S = S_dp(coluna)
    #utilizando uma distribuição normal padrao para um intervalo de confiança de 95%
    normal_padrao = 1.96
    n = len(coluna)
    return S * normal_padrao / (n**0.5)

intervalos_confianca_por_disciplina = {}


for coluna in df.columns:
    #tira os que sao NaN
    notas = df[coluna].dropna()
    #calcula a media de cada coluna

    if len(notas) > 50:
        media = notas.mean()

        #calcula o erro padrao de cada coluna(disciplina)
        erro = e_dp(notas)

        ic_inf = max(0, media - erro)
        ic_sup = min(10, media + erro)
        intervalos_confianca_por_disciplina[coluna] = (media, ic_inf, ic_sup)
        print(f"erro: {erro}, desvio padrao: {S_dp(notas)}")
        print(f"{coluna}: Média = {media:.2f}, IC Inferior = {ic_inf:.2f}, IC Superior = {ic_sup:.2f}")

gera_grafico(intervalos_confianca_por_disciplina)




#profile = ProfileReport(df, title="Relatório de Análise Exploratória de Dados", explorative=True)
#profile.to_file("relatorio_eda.html")

#print(f"Desvio Padrão Amostral (S): {S_dp(df)}")
#print(f"Erro Padrão (e): {e_dp(df)}")
#print(f"Intervalo de Confiança (95%): {ic_inf} a {ic_sup}")




