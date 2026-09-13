import json
import re
from pathlib import Path
import fitz

RAIZ = Path(__file__).resolve().parents[2]


def carregar_dados_prova(prova_id: str):
    inv_path = RAIZ / "work" / "inventario" / prova_id / "inventario.json"
    cands_path = RAIZ / "work" / "candidatos" / f"{prova_id}.json"
    
    inv = json.loads(inv_path.read_text(encoding="utf-8")) if inv_path.exists() else {}
    cands = json.loads(cands_path.read_text(encoding="utf-8")) if cands_path.exists() else {"candidatos": {}}
    
    return inv, cands


def mapear_2021():
    # 2021: 40 páginas
    # FG: Discursivas D1 (p2), D2 (p4), Objetivas 1-8 (p5-p13)
    # CE: Discursivas D3 (p14), D4 (p15), D5 (p16), Objetivas 9-35 (p17-p35)
    inv, cands = carregar_dados_prova("2021-licenciatura")
    cands_map = cands.get("candidatos", {})

    # Mapeamento confirmado visualmente e estruturalmente:
    questoes = [
        # Discursivas FG
        {"id": "2021-licenciatura-d01", "rotulo": "Questão Discursiva 1", "numero": 1, "tipo": "discursiva", "parte": "FG", "paginas": [2], "coluna": "1 coluna", "texto_base": "-"},
        {"id": "2021-licenciatura-d02", "rotulo": "Questão Discursiva 2", "numero": 2, "tipo": "discursiva", "parte": "FG", "paginas": [4], "coluna": "1 coluna", "texto_base": "-"},
        # Objetivas FG
        {"id": "2021-licenciatura-q001", "rotulo": "Questão 1", "numero": 1, "tipo": "objetiva", "parte": "FG", "paginas": [5], "coluna": "1 coluna", "texto_base": "-"},
        {"id": "2021-licenciatura-q002", "rotulo": "Questão 2", "numero": 2, "tipo": "objetiva", "parte": "FG", "paginas": [6, 7], "coluna": "1 coluna", "texto_base": "-"},
        {"id": "2021-licenciatura-q003", "rotulo": "Questão 3", "numero": 3, "tipo": "objetiva", "parte": "FG", "paginas": [8], "coluna": "1 coluna", "texto_base": "-"},
        {"id": "2021-licenciatura-q004", "rotulo": "Questão 4", "numero": 4, "tipo": "objetiva", "parte": "FG", "paginas": [9], "coluna": "1 coluna", "texto_base": "-"},
        {"id": "2021-licenciatura-q005", "rotulo": "Questão 5", "numero": 5, "tipo": "objetiva", "parte": "FG", "paginas": [10, 11], "coluna": "1 coluna", "texto_base": "-"},
        {"id": "2021-licenciatura-q006", "rotulo": "Questão 6", "numero": 6, "tipo": "objetiva", "parte": "FG", "paginas": [11], "coluna": "1 coluna", "texto_base": "-"},
        {"id": "2021-licenciatura-q007", "rotulo": "Questão 7", "numero": 7, "tipo": "objetiva", "parte": "FG", "paginas": [12], "coluna": "1 coluna", "texto_base": "-"},
        {"id": "2021-licenciatura-q008", "rotulo": "Questão 8", "numero": 8, "tipo": "objetiva", "parte": "FG", "paginas": [13], "coluna": "1 coluna", "texto_base": "-"},
        # Discursivas CE
        {"id": "2021-licenciatura-d03", "rotulo": "Questão Discursiva 3", "numero": 3, "tipo": "discursiva", "parte": "CE", "paginas": [14], "coluna": "1 coluna", "texto_base": "-"},
        {"id": "2021-licenciatura-d04", "rotulo": "Questão Discursiva 4", "numero": 4, "tipo": "discursiva", "parte": "CE", "paginas": [15], "coluna": "1 coluna", "texto_base": "-"},
        {"id": "2021-licenciatura-d05", "rotulo": "Questão Discursiva 5", "numero": 5, "tipo": "discursiva", "parte": "CE", "paginas": [16], "coluna": "1 coluna", "texto_base": "-"},
        # Objetivas CE
        {"id": "2021-licenciatura-q009", "rotulo": "Questão 9", "numero": 9, "tipo": "objetiva", "parte": "CE", "paginas": [17], "coluna": "2 colunas", "texto_base": "-"},
        {"id": "2021-licenciatura-q010", "rotulo": "Questão 10", "numero": 10, "tipo": "objetiva", "parte": "CE", "paginas": [18], "coluna": "2 colunas", "texto_base": "-"},
        {"id": "2021-licenciatura-q011", "rotulo": "Questão 11", "numero": 11, "tipo": "objetiva", "parte": "CE", "paginas": [19], "coluna": "coluna 1", "texto_base": "-"},
        {"id": "2021-licenciatura-q012", "rotulo": "Questão 12", "numero": 12, "tipo": "objetiva", "parte": "CE", "paginas": [19], "coluna": "coluna 2", "texto_base": "-"},
        {"id": "2021-licenciatura-q013", "rotulo": "Questão 13", "numero": 13, "tipo": "objetiva", "parte": "CE", "paginas": [20], "coluna": "coluna 1", "texto_base": "-"},
        {"id": "2021-licenciatura-q014", "rotulo": "Questão 14", "numero": 14, "tipo": "objetiva", "parte": "CE", "paginas": [20], "coluna": "coluna 2", "texto_base": "-"},
        {"id": "2021-licenciatura-q015", "rotulo": "Questão 15", "numero": 15, "tipo": "objetiva", "parte": "CE", "paginas": [21], "coluna": "coluna 1", "texto_base": "-"},
        {"id": "2021-licenciatura-q016", "rotulo": "Questão 16", "numero": 16, "tipo": "objetiva", "parte": "CE", "paginas": [21], "coluna": "coluna 2", "texto_base": "-"},
        {"id": "2021-licenciatura-q017", "rotulo": "Questão 17", "numero": 17, "tipo": "objetiva", "parte": "CE", "paginas": [22], "coluna": "coluna 1", "texto_base": "-"},
        {"id": "2021-licenciatura-q018", "rotulo": "Questão 18", "numero": 18, "tipo": "objetiva", "parte": "CE", "paginas": [22], "coluna": "coluna 2", "texto_base": "-"},
        {"id": "2021-licenciatura-q019", "rotulo": "Questão 19", "numero": 19, "tipo": "objetiva", "parte": "CE", "paginas": [23], "coluna": "coluna 1", "texto_base": "-"},
        {"id": "2021-licenciatura-q020", "rotulo": "Questão 20", "numero": 20, "tipo": "objetiva", "parte": "CE", "paginas": [23], "coluna": "coluna 2", "texto_base": "-"},
        {"id": "2021-licenciatura-q021", "rotulo": "Questão 21", "numero": 21, "tipo": "objetiva", "parte": "CE", "paginas": [24], "coluna": "coluna 1", "texto_base": "-"},
        {"id": "2021-licenciatura-q022", "rotulo": "Questão 22", "numero": 22, "tipo": "objetiva", "parte": "CE", "paginas": [24, 25], "coluna": "coluna 2 e p25", "texto_base": "-"},
        {"id": "2021-licenciatura-q023", "rotulo": "Questão 23", "numero": 23, "tipo": "objetiva", "parte": "CE", "paginas": [26], "coluna": "2 colunas", "texto_base": "-"},
        {"id": "2021-licenciatura-q024", "rotulo": "Questão 24", "numero": 24, "tipo": "objetiva", "parte": "CE", "paginas": [27], "coluna": "2 colunas", "texto_base": "-"},
        {"id": "2021-licenciatura-q025", "rotulo": "Questão 25", "numero": 25, "tipo": "objetiva", "parte": "CE", "paginas": [28], "coluna": "2 colunas", "texto_base": "-"},
        {"id": "2021-licenciatura-q026", "rotulo": "Questão 26", "numero": 26, "tipo": "objetiva", "parte": "CE", "paginas": [29], "coluna": "2 colunas", "texto_base": "-"},
        {"id": "2021-licenciatura-q027", "rotulo": "Questão 27", "numero": 27, "tipo": "objetiva", "parte": "CE", "paginas": [30], "coluna": "coluna 1", "texto_base": "-"},
        {"id": "2021-licenciatura-q028", "rotulo": "Questão 28", "numero": 28, "tipo": "objetiva", "parte": "CE", "paginas": [30], "coluna": "coluna 2", "texto_base": "-"},
        {"id": "2021-licenciatura-q029", "rotulo": "Questão 29", "numero": 29, "tipo": "objetiva", "parte": "CE", "paginas": [31], "coluna": "coluna 1", "texto_base": "-"},
        {"id": "2021-licenciatura-q030", "rotulo": "Questão 30", "numero": 30, "tipo": "objetiva", "parte": "CE", "paginas": [31], "coluna": "coluna 2", "texto_base": "-"},
        {"id": "2021-licenciatura-q031", "rotulo": "Questão 31", "numero": 31, "tipo": "objetiva", "parte": "CE", "paginas": [32], "coluna": "coluna 1", "texto_base": "-"},
        {"id": "2021-licenciatura-q032", "rotulo": "Questão 32", "numero": 32, "tipo": "objetiva", "parte": "CE", "paginas": [32], "coluna": "coluna 2", "texto_base": "-"},
        {"id": "2021-licenciatura-q033", "rotulo": "Questão 33", "numero": 33, "tipo": "objetiva", "parte": "CE", "paginas": [33], "coluna": "2 colunas", "texto_base": "-"},
        {"id": "2021-licenciatura-q034", "rotulo": "Questão 34", "numero": 34, "tipo": "objetiva", "parte": "CE", "paginas": [34], "coluna": "2 colunas", "texto_base": "-"},
        {"id": "2021-licenciatura-q035", "rotulo": "Questão 35", "numero": 35, "tipo": "objetiva", "parte": "CE", "paginas": [35], "coluna": "2 colunas", "texto_base": "-"},
    ]
    return questoes, cands_map


def mapear_2025_p1():
    # 2025 Prova 1: 48 páginas
    # FG: Objetivas 1-30 (p2-p17), Discursiva (p18)
    # CE: Objetivas 31-80 (p20-p47)
    inv, cands = carregar_dados_prova("2025-prova1")
    cands_map = cands.get("candidatos", {})

    # Mapeamento página a página das questões de 2025-prova1
    # Conforme seção 0.8:
    # Q01-02 p2-3 · Q03-04 p4 · Q05-06 p5 · Q07-09 p6 · Q10-11 p7 · Q12-13 p8 · Q14-15 p9 · Q16-17 p10 · Q18-19 p11
    # Q20-21 p12 · Q22-23 p13 · Q24-25 p14 · Q26-27 p15 · Q28 p16 · Q29-30 p17 · Discursiva p18
    # Q31-32 p20 · Q33-34 p21 · Q35-37 p22 · Q38-39 p23 · Q40-42 p24 · Q43 p25 · Q44-45 p26 · Q46-47 p27 · Q48-49 p28
    # Q50-51 p29 · Q52 p30 · Q53-54 p31 · Q55-56 p32 · Q57-58 p33-34 · Q59-61 p35 · Q62 p36 · Q63-64 p37 · Q65 p38
    # Q66-67 p39 · Q68-69 p40 · Q70 p41 · Q71-72 p42 · Q73-74 p43 · Q75-76 p44 · Q77-78 p45 · Q79 p46 · Q80 p47
    
    paginas_questoes = {
        1: [2, 3], 2: [2, 3], 3: [4], 4: [4], 5: [5], 6: [5], 7: [6], 8: [6], 9: [6], 10: [7],
        11: [7], 12: [8], 13: [8], 14: [9], 15: [9], 16: [10], 17: [10], 18: [11], 19: [11], 20: [12],
        21: [12], 22: [13], 23: [13], 24: [14], 25: [14], 26: [15], 27: [15], 28: [16], 29: [17], 30: [17],
        # CE
        31: [20], 32: [20], 33: [21], 34: [21], 35: [22], 36: [22], 37: [22], 38: [23], 39: [23], 40: [24],
        41: [24], 42: [24], 43: [25], 44: [26], 45: [26], 46: [27], 47: [27], 48: [28], 49: [28], 50: [29],
        51: [29], 52: [30], 53: [31], 54: [31], 55: [32], 56: [32], 57: [33, 34], 58: [33, 34], 59: [35], 60: [35],
        61: [35], 62: [36], 63: [37], 64: [37], 65: [38], 66: [39], 67: [39], 68: [40], 69: [40], 70: [41],
        71: [42], 72: [42], 73: [43], 74: [43], 75: [44], 76: [44], 77: [45], 78: [45], 79: [46], 80: [47],
    }

    tbs = {
        (1, 2): "tb-01-02",
        (5, 6): "tb-05-06",
        (10, 11): "tb-10-11",
        (12, 13): "tb-12-13",
        (31, 32): "tb-31-32",
        (38, 39): "tb-38-39",
        (40, 41): "tb-40-41",
        (44, 45): "tb-44-45",
        (46, 47): "tb-46-47",
        (50, 51): "tb-50-51",
        (53, 54): "tb-53-54",
        (75, 76): "tb-75-76",
        (79, 80): "tb-79-80",
    }

    def achar_tb(q_num):
        for (q1, q2), nome in tbs.items():
            if q1 <= q_num <= q2:
                return nome
        return "-"

    questoes = []
    # Objetivas FG 1 a 30
    for num in range(1, 31):
        questoes.append({
            "id": f"2025-prova1-q{num:03d}",
            "rotulo": f"Questão {num}",
            "numero": num,
            "tipo": "objetiva",
            "parte": "FG",
            "paginas": paginas_questoes[num],
            "coluna": "coluna" if len(paginas_questoes[num]) == 1 else "atravessa",
            "texto_base": achar_tb(num),
        })

    # Discursiva FG
    questoes.append({
        "id": "2025-prova1-d01",
        "rotulo": "Questão Discursiva 1",
        "numero": 1,
        "tipo": "discursiva",
        "parte": "FG",
        "paginas": [18],
        "coluna": "1 coluna",
        "texto_base": "-",
    })

    # Objetivas CE 31 a 80
    for num in range(31, 81):
        questoes.append({
            "id": f"2025-prova1-q{num:03d}",
            "rotulo": f"Questão {num}",
            "numero": num,
            "tipo": "objetiva",
            "parte": "CE",
            "paginas": paginas_questoes[num],
            "coluna": "coluna" if len(paginas_questoes[num]) == 1 else "atravessa",
            "texto_base": achar_tb(num),
        })

    return questoes, cands_map


def mapear_2025_p5():
    # 2025 Prova 5: 48 páginas
    inv, cands = carregar_dados_prova("2025-prova5")
    cands_map = cands.get("candidatos", {})

    # Mapeamento página a página das questões de 2025-prova5
    # Conforme seção 0.8:
    # Q01 p2 · Q02–03 p3 · Q04 p4 · Q05–07 p5 · Q08–09 p6 · Q10–11 p7 · Q12–14 p8 · Q15–16 p9 · Q17–19 p10
    # Q20–21 p11 · Q22 p12 · Q23–24 p13 · Q25–26 p14 · Q27–28 p15 · Q29 p16 · Q30 p17 · Discursiva p18
    # Q31–32 p20 · Q33–34 p21 · Q35–36 p22 · Q37–38 p23 · Q39–41 p24 · Q42–43 p25 · Q44–45 p26 · Q46–47 p27 · Q48–49 p28
    # Q50–51 p29 · Q52–53 p30 · Q54–55 p31 · Q56–57 p32 · Q58–59 p33 · Q60–61 p34 · Q62–63 p35 · Q64–65 p36 · Q66 p37
    # Q67–69 p38 · Q70–71 p39 · Q72–73 p40 · Q74–75 p41 · Q76 p42 · Q77–78 p43 · Q79 p44 · Q80 p45
    paginas_questoes = {
        1: [2], 2: [3], 3: [3], 4: [4], 5: [5], 6: [5], 7: [5], 8: [6], 9: [6], 10: [7],
        11: [7], 12: [8], 13: [8], 14: [8], 15: [9], 16: [9], 17: [10], 18: [10], 19: [10], 20: [11],
        21: [11], 22: [12], 23: [13], 24: [13], 25: [14], 26: [14], 27: [15], 28: [15], 29: [16], 30: [17],
        # CE
        31: [20], 32: [20], 33: [21], 34: [21], 35: [22], 36: [22], 37: [23], 38: [23], 39: [24], 40: [24],
        41: [24], 42: [25], 43: [25], 44: [26], 45: [26], 46: [27], 47: [27], 48: [28], 49: [28], 50: [29],
        51: [29], 52: [30], 53: [30], 54: [31], 55: [31], 56: [32], 57: [32], 58: [33], 59: [33], 60: [34],
        61: [34], 62: [35], 63: [35], 64: [36], 65: [36], 66: [37], 67: [38], 68: [38], 69: [38], 70: [39],
        71: [39], 72: [40], 73: [40], 74: [41], 75: [41], 76: [42], 77: [43], 78: [43], 79: [44], 80: [45],
    }

    tbs = {
        (8, 9): "tb-08-09",
        (10, 11): "tb-10-11",
        (15, 16): "tb-15-16",
        (17, 18): "tb-17-18",
        (20, 21): "tb-20-21",
        (23, 24): "tb-23-24",
        (25, 26): "tb-25-26",
        (31, 32): "tb-31-32",
        (33, 34): "tb-33-34",
        (35, 36): "tb-35-36",
        (37, 38): "tb-37-38",
        (42, 43): "tb-42-43",
        (44, 45): "tb-44-45",
        (46, 47): "tb-46-47",
        (48, 49): "tb-48-49",
        (50, 51): "tb-50-51",
        (52, 53): "tb-52-53",
        (54, 55): "tb-54-55",
        (68, 69): "tb-68-69",
        (70, 71): "tb-70-71",
        (72, 73): "tb-72-73",
        (77, 78): "tb-77-78",
    }

    def achar_tb(q_num):
        for (q1, q2), nome in tbs.items():
            if q1 <= q_num <= q2:
                return nome
        return "-"

    questoes = []
    # Objetivas FG 1 a 30
    for num in range(1, 31):
        questoes.append({
            "id": f"2025-prova5-q{num:03d}",
            "rotulo": f"Questão {num}",
            "numero": num,
            "tipo": "objetiva",
            "parte": "FG",
            "paginas": paginas_questoes[num],
            "coluna": "coluna",
            "texto_base": achar_tb(num),
        })

    # Discursiva FG
    questoes.append({
        "id": "2025-prova5-d01",
        "rotulo": "Questão Discursiva 1",
        "numero": 1,
        "tipo": "discursiva",
        "parte": "FG",
        "paginas": [18],
        "coluna": "1 coluna",
        "texto_base": "-",
    })

    # Objetivas CE 31 a 80
    for num in range(31, 81):
        questoes.append({
            "id": f"2025-prova5-q{num:03d}",
            "rotulo": f"Questão {num}",
            "numero": num,
            "tipo": "objetiva",
            "parte": "CE",
            "paginas": paginas_questoes[num],
            "coluna": "coluna",
            "texto_base": achar_tb(num),
        })

    return questoes, cands_map


def formatar_tabela_md(questoes, cands_map, titulo_prova):
    linhas = []
    linhas.append(f"### {titulo_prova}")
    linhas.append("")
    linhas.append("| Questão | Rótulo | Páginas | Parte | Tipo | Texto-Base | Figuras Raster | Suspeita Vetorial |")
    linhas.append("|---|---|---|---|---|---|---|---|")

    for q in questoes:
        pags_str = ", ".join(f"p.{p}" for p in q["paginas"])
        
        # Analisa candidatos nas páginas da questão
        n_raster = 0
        n_vetor = 0
        for p in q["paginas"]:
            cands_pag = cands_map.get(str(p), [])
            for c in cands_pag:
                if c["tipo"] == "raster":
                    n_raster += 1
                elif c["tipo"] == "vetorial":
                    n_vetor += 1

        raster_str = f"{n_raster} encontrada(s)" if n_raster > 0 else "0"
        vetor_str = f"{n_vetor} candidato(s)" if n_vetor > 0 else "0"

        linhas.append(
            f"| `{q['id']}` | {q['rotulo']} | {pags_str} | {q['parte']} | {q['tipo']} | {q['texto_base']} | {raster_str} | {vetor_str} |"
        )
    linhas.append("")
    return "\n".join(linhas)


def main():
    q2021, c2021 = mapear_2021()
    qp1, cp1 = mapear_2025_p1()
    qp5, cp5 = mapear_2025_p5()

    total_questoes = len(q2021) + len(qp1) + len(qp5)

    doc_md = []
    doc_md.append("# Mapa Completo de Questões — ENADE Matemática (2021, 2025-P1, 2025-P5)")
    doc_md.append("")
    doc_md.append(f"Total de questões inventariadas: **{total_questoes}** (2021: {len(q2021)}; 2025-P1: {len(qp1)}; 2025-P5: {len(qp5)}).")
    doc_md.append("Este documento orienta com precisão a extração de recortes da Fase 3 e a transcrição literal da Fase 4.")
    doc_md.append("")
    doc_md.append("---")
    doc_md.append("")

    doc_md.append(formatar_tabela_md(q2021, c2021, "1. ENADE 2021 · Matemática (Licenciatura) — 40 questões (35 Obj + 5 Disc)"))
    doc_md.append(formatar_tabela_md(qp1, cp1, "2. ENADE 2025 · Prova 1 (1ª Aplicação) — 81 questões (80 Obj + 1 Disc)"))
    doc_md.append(formatar_tabela_md(qp5, cp5, "3. ENADE 2025 · Prova 5 (2ª Aplicação) — 81 questões (80 Obj + 1 Disc)"))

    saida_md = RAIZ / "docs" / "MAPA-QUESTOES.md"
    saida_md.write_text("\n".join(doc_md), encoding="utf-8")
    print(f"Mapa gerado com sucesso em: {saida_md} ({total_questoes} questões mapeadas).")


if __name__ == "__main__":
    main()
