const CheckoutSteps = ({ current = 0 }) => {
  return (
    <ul className="steps steps-vertical lg:steps-horizontal w-full mt-4">
      {[
        'Login do Usuário',
        'Endereço de Entrega',
        'Método de Pagamento',
        'Fazer Pedido',
      ].map((step, index) => (
        <li
          key={step}
          className={`step
             ${index <= current ? 'step-primary' : ''}
             `}
        >
          {step}
        </li>
      ))}
    </ul>
  )
}
export default CheckoutSteps
