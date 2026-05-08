#CORRELAÇÃO ENTRE OS TÓPICOS E A MÉDIA FINAL(CRA) DOS ALUNOS
import pandas as pd
import matplotlib.pyplot as plt

df_topico1 = pd.read_csv('./files/topico_carreira.csv')
#df_topico2 = pd.read_csv('./files/topico_estudo.csv')
#df_topico3 = pd.read_csv('./files/topico_institucional.csv')    
#df_topico4 = pd.read_csv('./files/topico_interpessoal.csv')
#df_topico5 = pd.read_csv('./files/topico_pessoal.csv')


df_notas = pd.read_csv('./files/media_notas.csv')

#merge pelo nome
df = pd.merge(df_topico1, df_notas, on='name')
X = df.drop(columns=['name', 'media_final'])
y = df['media_final']

correlacao = (X.corrwith(y, method='spearman')).sort_values()
print(correlacao)

plt.figure(figsize=(10, 8))
plt.barh(correlacao.index, correlacao.values)
plt.xlabel('Correlação com o CRA')
plt.ylabel('Perguntas do Tópico Carreira')
plt.title('Correlação entre tópico carreira e CRA')

plt.grid(True)

plt.tight_layout()
plt.savefig('./files/correlacao_topico_carreira.png')
