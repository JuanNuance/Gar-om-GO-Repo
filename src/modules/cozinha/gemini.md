neste modulo ira conter a logica de negocio de cozinha, ou seja, aqui ficara os requisitos do module.
leia o contexto do projeto e e implemente os requisitos desse modulo cozinha! não precisa modificar as outras partes,  
  apenas incrementar a nova role de cozinha e a nova rota de acesso que ira mostrar os pedidos na cozinha, integrar com os outros serviços.
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
aqui tera como funcionalidade:
- role de cozinheiro
    - visualizar pedidos
    - mudar status do pedido

e essas informações ira vira dos garcons em tempo real, ou seja, quando um garcom criar um pedido, ira aparecer na cozinha em tempo real via websocket e quando o cozinheiro mudar o estatus do pedido, ira ser enviado via websocket para o garcom em tempo real, e tambem ira ser salvo no banco de dados com o id do restaurante, tempo de preparo e tempo de espera.
