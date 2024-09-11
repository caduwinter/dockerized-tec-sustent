
# dockerized-tec-sustent

Aplicação com conexão via socket utilizando Docker e PostgreSQL.

## Como rodar a aplicação

Siga os passos abaixo para rodar a aplicação corretamente.

### 1. Clonar o Repositório
Clone o repositório para sua máquina local:

```bash
git clone https://github.com/caduwinter/dockerized-tec-sustent.git
cd dockerized-tec-sustent
```

### 2. Instalar Docker e Docker Compose
Certifique-se de ter o Docker e o Docker Compose instalados em sua máquina. Se ainda não tiver, você pode instalá-los:

- [Instruções de instalação do Docker](https://docs.docker.com/get-docker/)
- [Instruções de instalação do Docker Compose](https://docs.docker.com/compose/install/)

### 3. Build e Up dos containers Docker
Para construir as imagens e rodar o projeto com Docker, execute:

```bash
docker-compose up --build
```

Este comando vai criar os containers necessários e iniciar os serviços definidos no `docker-compose.yml`.

### 4. Acessar a aplicação
Quando o Docker Compose terminar de subir os containers, você poderá acessar a aplicação em seu navegador, provavelmente em:

```bash
http://localhost:3000
```

### 5. Parar os containers
Para parar a execução dos containers, utilize o comando:

```bash
docker-compose down
```

### Observações:
- Verifique se a porta do PostgreSQL configurada no `docker-compose.yml` está disponível em sua máquina.
- Certifique-se de que as permissões de leitura e escrita estejam adequadas nos volumes mapeados pelo Docker.
- Se houver migrações no banco de dados, não esqueça de rodar os comandos necessários após subir os containers.
