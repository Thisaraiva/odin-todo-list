# Todo List App

![Todo List App Screenshot](https://via.placeholder.com/800x400.png?text=Todo+List+App+Screenshot) <!-- Substitua por um screenshot real do projeto -->

A **Todo List App** é uma aplicação web modular para gerenciamento de tarefas, desenvolvida como parte do currículo do [The Odin Project](https://www.theodinproject.com/). A aplicação permite criar, editar, excluir e organizar tarefas em projetos, com funcionalidades como filtragem por prioridade, ordenação por data e persistência de dados no `localStorage`. O projeto foi construído com foco em modularidade, acessibilidade e boas práticas de desenvolvimento.

[🔗 Acesse a aplicação ao vivo no GitHub Pages](https://Thisaraiva.github.io/odin-todo-list)

## Funcionalidades

- **Gerenciamento de Projetos**:
  - Criar, editar e excluir projetos (o projeto "Default" é protegido contra exclusão).
  - Selecionar um projeto ativo para visualizar suas tarefas.
- **Gerenciamento de Tarefas**:
  - Adicionar, editar e excluir tarefas com título, descrição, data de vencimento, prioridade, notas e checklist.
  - Marcar tarefas como concluídas ou não concluídas.
  - Filtrar tarefas por prioridade (Baixa, Média, Alta).
  - Ordenar tarefas por data (ascendente ou descendente).
  - Visualizar todas as tarefas de todos os projetos ou apenas de um projeto específico.
- **Persistência de Dados**:
  - Armazenamento de projetos e tarefas no `localStorage` para manter os dados entre sessões.
- **Interface Amigável**:
  - Design responsivo para dispositivos móveis e desktop.
  - Modais para adicionar/editar projetos e tarefas.
  - Suporte a acessibilidade com ARIA labels e navegação por teclado.
- **Testes**:
  - Testes unitários para as funcionalidades de `Todo` e `Project` usando Jest.

## Estrutura do Projeto

A estrutura do projeto é organizada para promover modularidade e manutenibilidade:

```
odin-todo-list/
├── src/
│   ├── __testes__/
│   │   ├── project.test.js      # Testes unitários para Project e ProjectManager
│   │   ├── todo.test.js        # Testes unitários para Todo
│   ├── modules/
│   │   ├── domController.js    # Controlador da interface do usuário (DOM)
│   │   ├── project.js          # Módulo para gerenciamento de projetos
│   │   ├── storage.js         # Módulo para persistência de dados
│   │   ├── todo.js            # Módulo para gerenciamento de tarefas
│   ├── styles/
│   │   ├── main.css           # Estilos gerais da aplicação
│   │   ├── modal.css          # Estilos para os modais
│   ├── index.html             # Página principal da aplicação
│   ├── index.js               # Ponto de entrada da aplicação
├── .babelrc                   # Configuração do Babel
├── eslint.config.mjs          # Configuração do ESLint
├── jest.config.js             # Configuração do Jest
├── package.json               # Dependências e scripts do projeto
├── webpack.config.js          # Configuração do Webpack
├── README.md                  # Documentação do projeto
```

## Tecnologias e Ferramentas

- **Linguagens e Bibliotecas**:
  - **JavaScript (ES6+)**: Para a lógica da aplicação, usando módulos ES.
  - **HTML5** e **CSS3**: Para estrutura e estilização, com design responsivo.
  - **date-fns**: Biblioteca para manipulação de datas.
- **Ferramentas de Build e Desenvolvimento**:
  - **Webpack**: Para empacotamento e servidor de desenvolvimento.
  - **Babel**: Para compatibilidade com navegadores mais antigos.
  - **ESLint**: Para linting e garantia de qualidade do código.
  - **Prettier**: Para formatação consistente do código.
  - **Jest**: Para testes unitários com ambiente JSDOM.
- **Outros**:
  - **Font Awesome**: Para ícones na interface.
  - **GitHub Pages**: Para hospedagem da aplicação.
  - **localStorage**: Para persistência de dados no navegador.

## Instalação e Configuração

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [Git](https://git-scm.com/)

### Passos para Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/<seu-usuario>/odin-todo-list.git
   cd odin-todo-list
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run start
   ```
   A aplicação será aberta automaticamente no navegador em `http://localhost:8080`.

4. (Opcional) Gere a build de produção:
   ```bash
   npm run build
   ```
   Os arquivos estáticos serão gerados na pasta `dist`.

5. (Opcional) Execute os testes:
   ```bash
   npm run test
   ```

6. (Opcional) Execute o linting:
   ```bash
   npm run lint
   ```

7. (Opcional) Formate o código:
   ```bash
   npm run format
   ```

## Como Usar

1. **Criar um Projeto**:
   - Clique em "New Project" no cabeçalho e insira um nome para o projeto.
   - O projeto será adicionado à barra lateral.
2. **Adicionar Tarefas**:
   - Clique em "Add Todo" e preencha os campos (título, descrição, data, prioridade, notas).
   - Selecione um projeto para associar a tarefa.
3. **Gerenciar Tarefas**:
   - Use os filtros de prioridade e ordenação para organizar as tarefas.
   - Marque tarefas como concluídas com a caixa de seleção.
   - Edite ou exclua tarefas usando os botões correspondentes.
4. **Visualizar Todas as Tarefas**:
   - Clique em "Show All Tasks" para ver tarefas de todos os projetos.

## Conceitos Aplicados

- **Modularidade**: O código é organizado em módulos (`todo.js`, `project.js`, `storage.js`, `domController.js`) para separação de responsabilidades.
- **Padrões de Projeto**: Uso de factory functions (`Todo`, `Project`, `ProjectManager`) para encapsulamento e criação de objetos.
- **Persistência**: Armazenamento de dados no `localStorage` para manter projetos e tarefas entre sessões.
- **Acessibilidade**: Uso de ARIA labels, navegação por teclado e foco visível para melhorar a acessibilidade.
- **Testes**: Testes unitários com Jest para validar a lógica de negócios.
- **Boas Práticas**:
  - Validação rigorosa de entrada de dados.
  - Tratamento de erros com mensagens claras.
  - Código formatado com Prettier e verificado com ESLint.

## Contribuição

1. Faça um fork do repositório.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`).
3. Commit suas alterações (`git commit -m 'Adiciona nova funcionalidade'`).
4. Envie para o repositório remoto (`git push origin feature/nova-funcionalidade`).
5. Abra um Pull Request.

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).

## Contato

Desenvolvido por Thiago Saraiva. Entre em contato pelo [LinkedIn](https://www.linkedin.com/in/thiago-saraiva-34a7895a/) ou [email](mailto:thiagofreitassaraiva@yahoo.com.br).