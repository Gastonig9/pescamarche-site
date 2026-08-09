import styled from "styled-components";
import tarjetasImg from "../../assets/tarjetas.jpeg";
import tarjetas2Img from "../../assets/tarjetas2.jpeg";

const faqs = [
  {
    question: "¿Qué medios de pago aceptan?",
    answer: "Disponemos de los siguientes medios de pago:",
    includeImg: true,
    imgSrc: tarjetas2Img,
  },
  {
    question: "¿Cuál es el costo de envío? / Costo de envío",
    answer:
      "El costo de envío será mostrado en base al total de la compra y ubicación, en el checkout, en el momento previo a la compra.",
  },
  {
    question: "¿Cómo se realizan los envíos?",
    answer: "Trabajamos con:",
    includeImg: true,
    imgSrc: tarjetasImg,
  },

  {
    question: "¿Cómo es el envío de las cañas?",
    answer:
      "El envio de las cañas las realizamos por via cargo o logistica a cualquier parte del pais! ya que por su altura correo argentino no las envia! Les pedimos por favor, no elegir envio al momento de comprar la caña, realice la compra normal con la opcion de retiro en tienda y una vez hecha la compra nos comunicaremos con usted para coordinar el envio!",
  },
  {
    question: "¿Dónde puedo recibir mi pedido?",
    answer: "Realizamos envíos a todo el país.",
  },
  {
    question: "¿Cuánto tarda en llegar el pedido?",
    answer:
      "El tiempo de entrega dependerá del tipo de envío seleccionado. En general, la demora es de entre 3 y 7 días hábiles luego de acreditado el pago.",
  },
  {
    question: "¿Cuál es el plazo para realizar un cambio?",
    answer:
      "Podés solicitar un cambio dentro de los 15 días luego de realizada la compra.",
  },
  {
    question: "¿Qué debo hacer si el producto no llega en buen estado?",
    answer:
      "Contactate con nosotros a alfredomarchetti1@hotmail.com o al 1128344179 y te enviaremos uno nuevo.",
  },
];

export function FaqPage() {
  return (
    <Container>
      <Title>Preguntas frecuentes</Title>
      {faqs.map((faq) => (
        <Item key={faq.question}>
          <Question>{faq.question}</Question>
          <Answer>{faq.answer}</Answer>
          {faq.includeImg && (
            <img
              src={faq.imgSrc}
              alt="Cañas de pesca"
              style={{ marginTop: "0.75rem", maxWidth: "100%" }}
            />
          )}
        </Item>
      ))}
    </Container>
  );
}

const Container = styled.section`
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 2rem 1.25rem;
  }
`;

const Title = styled.h1`
  margin-bottom: 2rem;
`;

const Item = styled.details`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 1rem 1.25rem;
  margin-bottom: 1rem;

  &[open] summary {
    color: ${({ theme }) => theme.colors.primary};
  }

  &[open] summary::after {
    transform: rotate(225deg);
  }
`;

const Question = styled.summary`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  font-weight: 700;
  cursor: pointer;
  list-style: none;

  &::-webkit-details-marker {
    display: none;
  }

  &::after {
    content: "";
    flex-shrink: 0;
    width: 8px;
    height: 8px;
    border-right: 2px solid currentColor;
    border-bottom: 2px solid currentColor;
    transform: rotate(45deg);
    transition: transform 0.2s ease;
  }
`;

const Answer = styled.p`
  margin: 0.75rem 0 0;
  color: ${({ theme }) => theme.colors.textLight};
`;
