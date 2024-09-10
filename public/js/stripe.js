import axios from 'axios';
import { showAlert } from './alerts';
// const stripe = Stripe(
//   'pk_test_51PxBDKP8Nbh1DqU6eR3PwboO2i2h1ZcxH1dCrf7ikLpussznIKBrB3eTDYmHcEQ3ei3n9fU9Y4Rc3PAjfPBBnwIs00hOfLJsiF',
// );

export const bookTour = async (tourId) => {
  const stripe = Stripe(
    'pk_test_51PxBDKP8Nbh1DqU6eR3PwboO2i2h1ZcxH1dCrf7ikLpussznIKBrB3eTDYmHcEQ3ei3n9fU9Y4Rc3PAjfPBBnwIs00hOfLJsiF',
  );
  try {
    //1) Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`,
    );
    //2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({ sessionId: session.data.session.id });
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};
