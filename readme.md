# 🍰 Cris Deguste - Confeitaria Tradicional e Inclusiva

Bem-vindo ao repositório oficial do projeto web da confeitaria **Cris Deguste**. Este projeto foi desenvolvido inteiramente do zero como parte das atividades acadêmicas universitárias, com o intuito de aplicar conceitos avançados de Front-End.

O foco central da aplicação é apresentar um catálogo de produtos de uma confeitaria familiar, destacando o cuidado com a inclusão alimentar (produtos tradicionais, zero açúcar e sem glúten), ao mesmo tempo em que oferece uma interface rica, responsiva e altamente interativa para o usuário final.

---

## 🎯 Objetivos e Requisitos Acadêmicos Atendidos

Este projeto foi construído para cumprir rigorosamente todos os requisitos da atividade proposta na disciplina:

- [x] **Estruturação Padrão:** Utilização dos arquivos `index.html`, `style.css` e `script.js`.
- [x] **Importação Correta:** Inclusão do JavaScript de forma externa via tag `<script src="script.js">`.
- [x] **Volume de Código JavaScript:** Implementação de mais de 5 funcionalidades distintas manipulando o DOM e eventos.
- [x] **Versionamento:** Uso do Git no VS Code com envios regulares para um repositório remoto no GitHub.
- [x] **Complexidade de Código:** Arquivos superando as métricas exigidas (HTML > 500 linhas, CSS > 400 linhas, JS > 300 linhas).
- [x] **Documentação:** Criação deste `README.md` com mais de 100 linhas explicando minuciosamente o projeto.
- [x] **Código Comentado:** Todo o JavaScript (e grande parte do CSS/HTML) possui comentários didáticos explicando a ação de blocos, funções e variáveis.

---

## ⚙️ Funcionalidades JavaScript Implementadas

Para garantir uma Experiência de Usuário (UX) moderna, a aplicação não depende apenas de HTML e CSS. O ecossistema de interatividade foi construído em **Vanilla JavaScript** (JS puro, sem bibliotecas externas), contendo as seguintes 8 funcionalidades:

### 1. Menu Mobile Responsivo (Toggle Menu)
Em telas menores que 900px, a barra de navegação tradicional é ocultada e substituída por um ícone de "Hambúrguer". O JavaScript escuta o clique neste ícone e manipula a lista de classes do elemento (através do método `.classList.toggle()`), deslizando o menu suavemente para dentro e fora da tela. Adicionalmente, ao clicar em qualquer link do menu, ele se recolhe automaticamente.

### 2. Modo Escuro (Dark Mode) com Persistência
Um botão de alternância de tema no cabeçalho permite que o usuário mude a interface de cores claras para cores escuras. 
- **Como funciona:** O JS injeta uma classe no `<body>` que altera variáveis CSS ativas.
- **Diferencial:** A preferência do usuário é salva na memória do navegador usando a API `localStorage`. Assim, se ele atualizar a página ou voltar outro dia, o site lembrará se ele prefere o modo claro ou escuro.

### 3. Acordeão Dinâmico de Perguntas Frequentes (FAQ)
Um sistema de expansão e retração de respostas. 
- **Como funciona:** Ao clicar em uma pergunta, o JavaScript varre todos os outros itens para forçar o fechamento deles (garantindo que apenas um fique aberto por vez para não poluir a tela). Em seguida, ele calcula a altura exata do conteúdo oculto usando a propriedade `scrollHeight` e aplica dinamicamente como estilo inline (`max-height`), permitindo uma animação CSS fluida.

### 4. Avaliações com Classificação em Estrelas (Rating System)
Um formulário interativo onde o cliente pode avaliar a confeitaria.
- **Como funciona:** O sistema escuta cliques nas 5 estrelas. Ele usa atributos de dados (`data-val`) para saber qual nota foi dada, colorindo as estrelas anteriores de dourado e atualizando um input oculto (`hidden`). Ao submeter, o evento padrão da página é prevenido (`e.preventDefault()`), o JS constrói um novo cartão HTML com a avaliação e o injeta dinamicamente no topo da lista (`prepend()`).

### 5. Botão Inteligente "Voltar ao Topo"
Para melhorar a navegação em uma página longa (One Page), um botão flutuante aparece dinamicamente no canto da tela.
- **Como funciona:** O `window.addEventListener('scroll')` verifica a posição atual da barra de rolagem. Se passar de 400 pixels, o botão se torna visível. Ao ser clicado, a API `window.scrollTo({ behavior: 'smooth' })` retorna o usuário ao topo da página suavemente.

### 6. Filtro Dinâmico de Cardápio
O usuário não precisa procurar manualmente pelos produtos. Botões permitem filtrar entre "Todos", "Tradicionais" e "Inclusivos".
- **Como funciona:** Cada doce no HTML possui um `data-category`. Ao clicar em um filtro, o JS percorre a matriz de produtos (`NodeList`) comparando as categorias. O que não corresponde recebe `display: none`, e o que corresponde recebe `display: flex`.

### 7. Carrinho de Compras Interativo e Sidebar
Uma das funções mais complexas do projeto. O cliente pode adicionar itens ao pedido sem sair da página.
- **Como funciona:** 
  - Um array `cart = []` armazena o estado global da aplicação.
  - Ao clicar em "Adicionar", os dados (`nome` e `preço`) são empurrados para o array via `.push()`.
  - A função `updateCartUI()` varre o array recriando a lista visual de itens na aba lateral, recalculando o valor monetário `total` em tempo real e atualizando a notificação (badge) vermelha no ícone do carrinho.
  - Também é possível remover itens específicos, acionando o método `.splice()`.

### 8. Formulário Fale Conosco e Sistema de Notificações Toast
Substituímos os alertas nativos do navegador (`alert()`) por *Toasts* (notificações flutuantes elegantes).
- **Como funciona:** O JS escuta o envio do formulário de contato. Ele faz validações condicionais (se os campos estão vazios, se o e-mail não contém '@', etc.). Em vez de recarregar a tela ou mostrar um popup padrão, ele invoca a função `showToast('mensagem', 'tipo')`. Essa função cria um elemento HTML temporário, injeta na tela com animação de CSS, e o destrói automaticamente com `setTimeout()` após 3 segundos.

---

## 📂 Estrutura de Diretórios e Arquivos

O projeto adota uma arquitetura clássica e limpa para Front-End nativo:

```text
raiz_do_projeto/
├── index.html       # Estrutura principal da página (Semântica HTML5)
├── style.css        # Estilos, variáveis de cor, responsividade e layout (CSS3)
├── script.js        # Regras de negócios, manipulação de DOM e interações
└── README.md        # Documentação completa e detalhada do sistema
```

---

## 🚀 Como Executar o Projeto Localmente

Se você é o avaliador ou outro desenvolvedor querendo testar a aplicação, siga estes passos muito simples:

1. **Pré-requisitos básicos:** 
   Você só precisa de um navegador moderno atualizado (Google Chrome, Mozilla Firefox, Microsoft Edge ou Safari). Não há necessidade de instalar Node.js ou bancos de dados, pois a aplicação roda 100% Client-Side.
2. **Clone o repositório:**
   Abra o seu terminal de preferência e execute o comando:
   ```bash
   git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
   ```
3. **Abra os arquivos:**
   Navegue até a pasta do projeto recém clonada.
4. **Rodando a aplicação:**
   - **Opção A (Simples):** Dê um duplo clique no arquivo `index.html`. Ele será aberto pelo seu navegador padrão e tudo já estará funcionando.
   - **Opção B (Profissional):** Abra a pasta no editor *Visual Studio Code*. Instale a extensão "Live Server". Clique com o botão direito no `index.html` e selecione "Open with Live Server". Isso criará um servidor local na porta 5500 e recarregará a página a cada salvamento do código.

---

## 🛠️ Tecnologias e Técnicas Utilizadas

- **HTML5:** Foco total em tags semânticas (`<header>`, `<nav>`, `<section>`, `<footer>`, `<article>`) garantindo melhor indexação e legibilidade estrutural.
- **CSS3 Avançado:**
  - **Flexbox:** Usado exaustivamente para alinhar menus, grades de produtos, cartões e estrutura do carrinho.
  - **Custom Properties (Variables):** Definição de paleta de cores raiz para facilitar a gestão do modo escuro.
  - **Media Queries:** Garantia de que a aplicação seja responsiva, ou seja, adaptável a smartphones, tablets e desktops de telas grandes.
  - **Animações e Transições:** Utilização de `transition: 0.3s ease` para que hovers, sliders e trocas de cor não sejam abruptos.
- **JavaScript Moderno (ES6+):**
  - Arrow Functions.
  - Template Literals (Template Strings) para injetar variáveis HTML com facilidade.
  - Arrays e laços de repetição avançados (`forEach`, `push`, `splice`).
  - Web Storage API (`localStorage`).

---

## 👨‍💻 Autoria e Finalidade Educacional

Este sistema foi concebido, arquitetado e desenvolvido estritamente para propósitos de estudo em nível superior (Projeto Acadêmico). As imagens presentes no projeto têm caráter puramente ilustrativo e foram retiradas do repositório público **Unsplash**, sendo de domínio público e uso livre. 

Agradecimentos ao corpo docente pelas orientações na construção de interfaces escaláveis. Todos os direitos reservados.