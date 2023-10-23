# pokedex-api

Projeto 'Minha Pokédex' desenvolvido com backend em Node JS.

É necessário criar o banco de dados a seguir:
```
CREATE DATABASE `pokedex` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
```

## Project setup
```
npm install
```

Após executar o comando acima e criar o banco de dados, executar o comando a seguir para criar as tabelas do banco de dados a partir da Migration que possui no projeto.

```
knex migrate:latest
```

### Compiles and hot-reloads for development
```
npm run serve
```
