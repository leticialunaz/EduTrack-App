import sqlite3
import pandas as pd

df_dcc = pd.read_csv('./files/Disciplinas_cc.csv')
df_d = pd.read_csv('./files/Discipline.csv')
df_sg = pd.read_csv('./files/Sgrade.csv')
df_u = pd.read_csv('./files/User.csv', encoding='latin-1') # para lidar com caracteres acentuados

conn = sqlite3.connect('notas_disciplinas.db')

df_dcc.to_sql('Disciplinas_cc', conn, if_exists='replace', index=False)
df_d.to_sql('Discipline', conn, if_exists='replace', index=False)
df_sg.to_sql('Sgrade', conn, if_exists='replace', index=False)
df_u.to_sql('User', conn, if_exists='replace', index=False)

#filtro para pegar apenas as disciplinas que estão presentes em ambos os arquivos
query_disciplinas = '''
SELECT d.name, d.id 
FROM Discipline d 
RIGHT JOIN Disciplinas_cc dc ON d.name = dc.Disciplinas_CC
WHERE d.name IS NOT NULL;
'''

resultado = pd.read_sql_query(query_disciplinas, conn)

resultado.to_sql('Disciplinas_corretas', conn, if_exists='replace', index=False)



query_notas_disc = '''
SELECT u.name as aluno, d.name as disciplina, sg.disciplineId, sg.grade 
FROM Sgrade sg
JOIN User u ON sg.userId = u.id
JOIN Disciplinas_corretas d ON sg.disciplineId = d.id
;
'''

df_notas_disc = pd.read_sql_query(query_notas_disc, conn)


notasNome_x_disciplina = df_notas_disc.pivot(
    index='aluno',
    columns='disciplina',
    values='grade'
).reset_index()

notasNome_x_disciplina.to_sql('NotasNome_x_Disciplina', conn, if_exists='replace', index=False)
notasNome_x_disciplina.to_csv('./files/notasNome_x_disciplina.csv', index=False)    