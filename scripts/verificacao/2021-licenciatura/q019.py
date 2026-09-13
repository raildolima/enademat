"""
Verificação da Questão 19 - ENADE 2021 Matemática Licenciatura
Operações com matrizes: somas por linha e por coluna
"""
import numpy as np

def verificar_q019():
    # Irmãos: 1: Arthur, 2: Bruno, 3: Guilherme, 4: Matheus
    # a_ij = desafios que o irmão i fez ao irmão j
    A = np.array([
        [0, 3, 1, 2],
        [5, 0, 3, 6],
        [2, 1, 0, 4],
        [6, 0, 6, 0]
    ])
    
    # Desafios propostos pelo irmão i = soma da linha i
    desafios_propostos = A.sum(axis=1)
    # Desafios recebidos pelo irmão j = soma da coluna j
    desafios_recebidos = A.sum(axis=0)
    
    irmaos = ["Arthur", "Bruno", "Guilherme", "Matheus"]
    for idx, (p, r) in enumerate(zip(desafios_propostos, desafios_recebidos)):
        print(f"{irmaos[idx]}: Propostos = {p}, Recebidos = {r}")
        
    mais_desafiou_val = desafios_propostos.max()
    mais_desafiou_idx = desafios_propostos.argmax()
    
    menos_desafiado_val = desafios_recebidos.min()
    menos_desafiado_idx = desafios_recebidos.argmin()
    
    print(f"\nIrmão que mais desafiou: {irmaos[mais_desafiou_idx]} ({mais_desafiou_val} desafios)")
    print(f"Irmão que menos foi desafiado: {irmaos[menos_desafiado_idx]} ({menos_desafiado_val} desafios)")
    
    diferenca = mais_desafiou_val - menos_desafiado_val
    print(f"Diferença: {mais_desafiou_val} - {menos_desafiado_val} = {diferenca}")
    
    assert mais_desafiou_val == 14
    assert menos_desafiado_val == 4
    assert diferenca == 10
    print("Alternativa D rigorosamente confirmada!")

if __name__ == '__main__':
    verificar_q019()
