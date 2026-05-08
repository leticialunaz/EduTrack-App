import pandas as pd
import numpy as np
import scipy.stats as st
from gera_grafico import gera_grafico


df = pd.read_csv('./files/notas_x_disciplina.csv')

#df = (pd.read_csv('./files.csv/notas_fmcc.csv')).dropna()
cl = 0.95



intervalos_confianca_por_disciplina = {}

for coluna in df.columns:
    #tira os que sao NaN
    notas = df[coluna].dropna()
    #calcula a media de cada coluna

    if len(notas) >= 30:
        media = notas.mean()

        #calcula o intervalo de confiança de cada coluna(disciplina)
        ci = st.t.interval(cl, len(notas)-1, loc=media, scale=np.std(notas, ddof=1)/np.sqrt(len(notas)))

        ic_inf = ci[0]
        ic_sup = ci[1]
        intervalos_confianca_por_disciplina[coluna] = (media, ic_inf, ic_sup)
        #print(f"{coluna}: Média = {media:.2f}, quantidade alunos = {len(notas)}, IC  Inferior = {ic_inf:.2f}, IC Superior = {ic_sup:.2f}")


df_intervalos = pd.DataFrame(intervalos_confianca_por_disciplina)


#linha[0] = media, linha[1] = ic_inf, linha[2] = ic_sup
df_intervalos.to_csv(
    './files/intervalos_confianca_disciplina.csv',
    index=True
)

#grafico = gera_grafico(intervalos_confianca_por_disciplina)
#grafico.savefig('intervalos_confianca.png')
