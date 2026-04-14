from pathlib import Path
path = Path(r"c:\mobile pet patrick\mobile_pet\src\pages\TelaInicial\TelaInicial.js")
text = path.read_text(encoding='utf-8')
start = text.find('{cards.map((card) => (')
if start == -1:
    raise SystemExit('start not found')
end = text.find('            ))}', start)
if end == -1:
    raise SystemExit('end not found')
end += len('            ))}')
new_block = '''{cards.map((card) => (
              <DashboardCard
                key={card.id}
                icon={card.icon}
                title={card.title}
                description={card.description}
                badge={card.badge}
                onPress={() => handleCardPress(card.id)}
              />
            ))}'''
text = text[:start] + new_block + text[end:]
path.write_text(text, encoding='utf-8')
print('patched block')
