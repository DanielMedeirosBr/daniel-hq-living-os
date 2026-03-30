# Daniel HQ — Development Log 26/03/05

## Projeto
Sistema de automação residencial com backend Node.js rodando em servidor Debian 24/7.

Objetivo: criar um motor de automação doméstica modular com eventos, sensores, cenas e controle de dispositivos.

Magic Home — “Tecnologia suficientemente avançada é indistinguível de magia.”

---

## Definições do projeto

2026/03/19: A ideia principal do sistema é mapear a relação entre espaço físico e intenção humana.
2026/03/19: Room é a menor unidade espacial com identidade própria capaz de interpretar e reagir a intenções.
## Infraestrutura Atual

Master (desenvolvimento)
OS: Windows
Editor: VS Code
Conexão: Remote SSH

Server (runtime)
OS: Debian
IP: 192.168.1.17
Função: executar o backend da casa

Backend
Node.js
Gerenciado por: PM2
---

## Estrutura do Projeto

controllers/
core/
data/
routes/
services/
state/
ui/

Arquivos principais:
server.js
package.json
---

## Componentes Arquiteturais

EventBus
Sistema de eventos interno para comunicação entre módulos.

HouseEngine
Motor principal da casa.
Responsável por coordenar sensores, dispositivos e automações.

LogEngine
Sistema centralizado de logs e histórico.

State
Armazena estados persistentes:
- presence
- sensors
- rooms
- scenes
- energy
---

## Decisões Técnicas

VS Code Remote SSH usado para desenvolvimento direto no servidor.

Servidor roda permanentemente via PM2.

Arquitetura modular separada por:
- controllers
- services
- core
- state
---

## 2026/03/09

Nova engine route:

API Layer
   controllers
   routes

Automation Core
   eventBus
   houseEngine

Device Layer
   services
   integrations (tuya)

State Layer
   state
   data

Runtime
   logs
   
EventBus Funcional

HouseEngine como orquestrador central

Criação de logs persistentes.


## 2026/03/19

Nova organização do sistema com a entrada do deviceRegistry:

deviceRegistry → resolve identidade (room + device)
EventBus       → orquestra
HouseEngine    → executa
deviceService  → integra com Tuya
logEngine      → registra narrativa

Nova arquitetura em funcionamento com log ok e simplificado.

API → EventBus → Engine → Service → Device

Primeira UI funcional com botão para as luzes e animação On/Off

UI testada com versão atualizada trazendo uma interface high end, funcional.

Limpando e refinando todos os códigos:
tuyaService.js
deviceService.js
houseEngine.js
eventBus.js
index.html
server.js
room.js
device.js


## 2026/03/20

Log do dia na troca de conversa com o GPT

🧠 Daniel HQ — Estado Atual do Sistema (Resumo para Continuação)
📍 Contexto Geral

Sistema de automação residencial próprio, rodando em Node.js, com arquitetura modular e orientada a eventos.

Servidor local (Debian + PM2), ainda não totalmente estável (energia + rede em melhoria).

Integração principal: Tuya (fonte de verdade atual)

🏗️ Arquitetura Atual
🔹 Fluxo principal
API → EventBus → HouseEngine → deviceService → tuyaService → Device
🔹 Camadas

Core

eventBus → sistema de eventos

houseEngine → orquestrador

Services

deviceService → abstração de dispositivos

tuyaService → integração com Tuya

Data / State

devices.json → configuração atual

state/ → planejado (não é fonte de verdade ainda)

Routes

/device

/room

/access

UI

HTML + JS puro

Interface minimalista com glow

Controle por room

🎛️ UI Atual

Interface baseada em rooms

Botão principal controla grupo de dispositivos

Visual moderno (mirror + glow)

Totalmente funcional via browser (sem app)

📡 Controle atual

UI web

NFC tags → abrem URLs específicas por room

Acesso baseado em contexto físico (sem login)

🔐 Modelo de acesso (em construção)

Guest → controle básico

User → controle ampliado

Admin → controle total

Permissão definida via:
👉 URL da NFC tag + contexto físico

⚠️ Limitação atual importante

Server ainda não é 100% confiável (24/7)

Portanto:

❌ não é fonte de verdade

✅ Tuya continua sendo a verdade

🧠 Decisão arquitetural atual

Sistema funciona como:

Tuya = realidade
Server = observador + orquestrador
💡 Ideia de produto (ainda não implementada)

Transformar o sistema em:

Interface gráfica orientada a rooms (modelo espacial da casa)

Onde:

rooms são entidades principais

devices vivem dentro delas

UI reflete o ambiente real

📱 Interface física planejada

Tablet na parede (browser fullscreen)

UI própria (sem apps terceiros)

Controle por toque + NFC

🚀 Direção futura
Próximos passos possíveis:

Melhorar UI para múltiplos dispositivos por room

Definir comportamento de “estado da room”

Estruturar melhor níveis de acesso (guest/user/admin)

Padronizar eventos

(Futuro) introduzir state confiável

(Futuro) automações e rules

🎯 Insight central do projeto

Não é um sistema de automação.

É:

um sistema que modela a casa e entrega controle contextual baseado no ambiente

🧠 Observação importante

Sistema está limpo, funcional e estável

Código foi recentemente revisado e refinado

UI já tem identidade própria

Arquitetura já suporta evolução para produto

💬 Pedido para próxima conversa

"Quero continuar evoluindo o Daniel HQ focando em UI orientada a rooms, controle por NFC e evolução para produto, sem depender ainda de state local confiável."

Se você colar isso na próxima conversa, eu entro no contexto praticamente no mesmo ponto em que estamos aqui — sem você precisar reconstruir tudo.

---

DEV_LOG — Magic Home (Smarthome Operation System)

📅 Data

29/03/2026

---

🧠 Definições de Arquitetura — Iluminação LED Endereçável

🔧 Controladoras

- Utilização de ESP32 como unidade de controle
- Limite definido: máximo de 5 saídas (GPIOs) por ESP32
- Distribuição modular por ambiente para garantir:
  - estabilidade
  - escalabilidade
  - facilidade de manutenção

---

💡 Tipo de Fita LED

- Padrão definido: WS2815 (12V, endereçável)

- Justificativas:
  
  - compatível com infraestrutura 12V existente
  - menor queda de tensão
  - maior robustez para trechos de até ~7m
  - ideal para segmentação física

- Estratégia:
  
  - compra em volume (redução de custo)
  - corte e customização manual conforme zonas

---

🧩 Segmentação

- Cada zona será fisicamente independente

- Regra:
  
  - ideal: até 5m
  - aceitável: até 7m

- Cada zona:
  
  - 1 linha de dados dedicada
  - controle independente via GPIO

---

⚡ Alimentação

- Arquitetura definida:
  
  - 1 fonte 12V por ambiente
  - uso de infraestrutura 12V já existente
  - suporte por 2 UPS centralizados

- Observações:
  
  - distribuição inteligente será definida posteriormente
  - possível uso de fontes auxiliares para cargas específicas (LED / spots)

---

🔌 Referência Elétrica

- GND equipotencializado em todo o sistema
- Obrigatório para:
  - estabilidade do sinal
  - evitar flicker e comportamento errático

---

🧯 Camada de Segurança / Controle Físico

- Uso de Sonoff para:
  
  - corte de energia por ambiente
  - fallback manual
  - proteção e manutenção

- NÃO utilizado para:
  
  - controle lógico de LEDs
  - segmentação de zonas

---

🧵 Infraestrutura de Cabeamento

- Padrão definido:
  
  - utilização de cabo CAT6 por ponto de LED

- Benefícios:
  
  - 8 vias disponíveis por ponto
  - flexibilidade para:
    - dados
    - alimentação auxiliar
    - redundância futura
    - expansão

- Estrutura mínima por zona:
  
  - 1 fio → dados
  - 2 fios → alimentação (V+ e GND)
  - restante → reserva estratégica

---

🧠 Arquitetura de Controle

- Sistema central: Magic SO (Smarthome Operation System)

- Responsabilidades:
  
  - orquestração das zonas
  - execução de cenas
  - abstração da lógica

- ESP32:
  
  - atuadores distribuídos (edge devices)
  - execução de comandos recebidos

---

🔥 Princípios Consolidados

- Separação clara entre:
  
  - energia
  - dados
  - lógica

- Modularidade > centralização

- Infraestrutura preparada para expansão futura

- Independência de cloud (controle local)

---

🚀 Status

✅ Arquitetura base definida
✅ Pronto para planejamento físico e elétrica detalhada
⏳ Próximo passo: diagrama elétrico + layout por ambiente

---


# 🧠 Dev Log — MagicOS

**Data:** 2026-03-29
**Status:** Avanço crítico concluído
**Resultado:** MagicOS 1 x 0 Tuya IoT Platform

---

## 🏆 Vitória do dia

Hoje vencemos uma das barreiras mais importantes do sistema:

✔ Extração completa dos `local_key` dos dispositivos
✔ Mapeamento correto de dispositivos reais
✔ Entendimento profundo das diferenças entre:

* dispositivos Elgin (3.3)
* dispositivos Ekaza (3.5)

👉 Isso destrava o controle local dos devices e reduz a dependência da nuvem da Tuya.

---

## 🧩 Decisões arquiteturais tomadas

### 1. 📦 Separação de responsabilidades

O sistema agora está dividido em:

* **devices.json**

  * identifica tipo de dispositivo
  * contém referência via `capability_id`

* **capabilities**

  * define comportamento do device
  * contém todos os `codes`, `dp_id`, `type`, etc

* **state**

  * tempo real
  * sem poluição estrutural

* **logs**

  * histórico e observabilidade

👉 Resultado: estrutura limpa, previsível e escalável.

---

### 2. 🔗 Ligação por `capability_id`

Decisão importante:

✔ O vínculo entre device e comportamento será feito via `capability_id`

👉 Isso elimina:

* dependência de IDs dinâmicos da Tuya
* acoplamento com API externa
* ambiguidade de modelo

---

### 3. 📉 Remoção de complexidade desnecessária

Decisões estratégicas:

* ❌ Não usar `min/max` nas capabilities (por enquanto)
* ❌ Não misturar timestamps dentro do device
* ❌ Não depender de estrutura rígida da Tuya

✔ Foco em:

* simplicidade
* lógica própria
* evolução controlada

---

### 4. 🎯 Modelo mental adotado

O MagicOS agora segue o paradigma:

> **Sistema central controla os dispositivos — dispositivos apenas executam comandos**

Isso abre caminho para:

* controle total local
* baixa latência
* independência da nuvem
* comportamento customizado

---

## 🧪 Estado atual do sistema

✔ Local keys obtidas
✔ Dispositivos identificados
✔ Capabilities modeladas
✔ Estrutura de dados organizada
✔ Base pronta para controle local

👉 Ainda falta:

* comunicação direta MagicOS → dispositivos
* camada de execução (driver)
* integração em tempo real

---

## ⚠️ Pontos de atenção

### 1. 📶 Controle em tempo real

Quando começar a enviar comandos:

* respeitar limites de envio
* evitar sobrecarga de rede
* aplicar suavização de valores

---

### 2. 🧠 Complexidade futura

O sistema já está no caminho de evoluir para:

* processamento de áudio em tempo real
* automação baseada em eventos
* orquestração de múltiplos dispositivos

👉 Isso exige cuidado com:

* performance
* latência
* consistência de estado

---

## 🚀 Próximos passos (prioridade alta)

### 1. 🔌 Integração local com dispositivos

Objetivo:

* conectar diretamente com as lâmpadas
* sem depender da cloud

👉 Usar:

* `local_key`
* `device_id`
* protocolo local da Tuya

---

### 2. ⚙️ Criar o “driver” de dispositivos

Camada responsável por:

* enviar comandos
* interpretar capabilities
* abstrair diferenças entre modelos

---

### 3. 🎛️ Sistema de controle central

* 1 comando → 1 comportamento
* normalização de valores
* tradução de intenção → ação

---

### 4. 🎵 Base para modo música

Preparação:

* pipeline de áudio
* leitura de frequência
* mapeamento inicial para efeitos

👉 Sem acoplamento direto com dispositivos ainda

---

## 🧭 Visão geral

Hoje saímos de:

❌ Dependência da Tuya
❌ Dúvidas de arquitetura
❌ Falta de controle dos dispositivos

Para:

✅ Sistema estruturado
✅ Base pronta para controle local
✅ Modelo mental definido
✅ Capacidade de evolução clara

---

## 🔥 Conclusão

Hoje foi um dia decisivo.

O MagicOS deixou de ser apenas uma ideia e passou a ter:

> **estrutura, identidade e direção**

Agora o foco muda completamente:

👉 de **decidir como extrair dados**
👉 para **fazer o sistema agir no mundo real**

---

## ➡️ Próximo checkpoint

Quando voltarmos:

* MagicOS falando com os dispositivos
* primeiro comando real enviado localmente
* validação do pipeline completo

---


## Próximos Passos

Implementar automações baseadas em eventos.

Integrar sensores e dispositivos.

Inotroduzir regras:
rules/
  presenceRules.js
  energyRules.js

Padronizar eventos

rules/
  presenceRules.js
  energyRules.js

device.action
device.success
device.error

presence.detected
presence.lost

system.start
system.boot

power.grid.lost
power.grid.restored

Criar um sistema gráfico orientado à room:
   Criar e deletrar rooms
   Adicionar dispositivos
   Gerenciar automações
   Gerenciar ambientes
   Gerenciar rotinas


Sobre a UI das rooms:
   Sensores para definir estado:
      Stand by (fundo negro e relógio com opacidade ~0.3)
      Próximo (Tela acesa em estado de bloqueio)
      Funcional (Tela de menus liberada)
      Narrativa que inicia conversa (estado tri-louco)
   Um background elegante
      Relógio
      Imagem
      Logo
   Acesso à room (principal)
      Dispositvos
      Grupos
   Interação e narrativa
      Assistente de voz
      Ajuda
      Logs do sistema
   Cenas
      Existentes
      Gerenciar
   Rotinas
      Existentes
      Gerenciar

