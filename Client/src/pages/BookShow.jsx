import React, { useState, useEffect } from "react";
import { getShowById } from "../api/show";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { message, Card, Row, Col, Button } from "antd";
import moment from "moment";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { bookShow, makePayment, makePaymentAndBookShow, createPaymentIntent } from "../api/booking";

const stripePromise = loadStripe(
  "pk_test_51SKMtgPM9ciN7MWVWnnWfQFwgH8TDr9IB6o1GKDgDaopU6O1z4Es00I1Zm7bOEoAeJ1QjGFucH8QykmDzEYGw3ex00iDNSYjDK"
);

const CheckoutForm = ({ show, selectedSeats, onSuccess, user, params, dispatch, navigate }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handlePay = async () => {
    if (!stripe || !elements) return;
    try {
      dispatch(showLoading());
      const amountInPaise = selectedSeats.length * show.ticketPrice * 100;
      const intentRes = await createPaymentIntent({
        amount: amountInPaise,
        currency: "inr",
        receipt_email: user?.email,
      });
      if (!intentRes?.success) {
        message.error(intentRes?.message || "Failed to create payment intent");
        return;
      }
      const clientSecret = intentRes.data.clientSecret;
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });
      if (error) {
        message.error(error.message || "Payment failed");
        return;
      }
      if (paymentIntent && paymentIntent.status === "succeeded") {
        const bookingRes = await bookShow({
          show: params.id,
          transactionId: paymentIntent.id,
          seats: selectedSeats,
          user: user._id,
        });
        if (bookingRes.success) {
          message.success("Show Booking done!");
          onSuccess();
          navigate("/profile");
        } else {
          message.warning(bookingRes.message || "Booking failed after payment");
        }
      }
    } catch (err) {
      message.error(err?.message || "Something went wrong");
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <div className="max-width-600 mx-auto">
      <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12, marginBottom: 12 }}>
        <CardElement options={{ hidePostalCode: true }} />
      </div>
      <Button type="primary" shape="round" size="large" block disabled={!stripe} onClick={handlePay}>
        Pay Now
      </Button>
    </div>
  );
};

const BookShow = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const [show, setShow] = useState();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const getData = async () => {
    try {
      dispatch(showLoading());
      const response = await getShowById({ showId: params.id });
      if (response.success) {
        setShow(response.data);
      } else {
        message.warning(response.message);
      }
    } catch (err) {
      message.error(err.message);
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // const book = async (transactionId) => {
  //   try {
  //     dispatch(showLoading());
  //     const response = await bookShow({
  //       show: params.id,
  //       transactionId,
  //       seats: selectedSeats,
  //       user: user._id,
  //     });
  //     if (response.success) {
  //       message.success("Show Booking done!");
  //       navigate("/profile");
  //     } else {
  //       message.warning(response.message);
  //     }
  //   } catch (err) {
  //     message.error(err.message);
  //   } finally {
  //     dispatch(hideLoading());
  //   }
  // };

  // const onToken = async (token) => {
  //   try {
  //     dispatch(showLoading());
  //     const response = await makePayment(
  //       token,
  //       selectedSeats.length * show.ticketPrice * 80
  //     );
  //     if (response.success) {
  //       message.success(response.message);
  //       book(response.data);
  //     } else {
  //       message.warning(response.message);
  //     }
  //   } catch (err) {
  //     message.error(err.message);
  //   } finally {
  //     dispatch(hideLoading());
  //   }
  // };

  const bookAndPay = async () => {};

  const getSeats = () => {
    let columns = 12;
    let totalSeats = show?.totalSeats;
    let rows = Math.ceil(totalSeats / columns) | 0;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="w-100 max-width-600 mx-auto mb-25px">
          <p className="text-center mb-10px">
            Screen this side, you will be watching in this direction
          </p>
          <div className="screen-div"></div>
          <ul className="seat-ul justify-content-center">
            {Array.from(Array(rows).keys()).map((row) => {
              return Array.from(Array(columns).keys()).map((column) => {
                let seatNumber = row * columns + column + 1;
                let seatClass = "seat-btn";
                if (selectedSeats.includes(seatNumber)) {
                  seatClass += " selected";
                }
                if (show.bookedSeats.includes(seatNumber)) {
                  seatClass += " booked";
                }
                if (seatNumber <= totalSeats)
                  return (
                    <li>
                      <button
                        onClick={() => {
                          if (!seatClass.split(" ").includes("booked")) {
                            if (selectedSeats.includes(seatNumber)) {
                              setSelectedSeats(
                                selectedSeats.filter(
                                  (curSeatNumber) =>
                                    curSeatNumber !== seatNumber
                                )
                              );
                            } else {
                              setSelectedSeats([...selectedSeats, seatNumber]);
                            }
                          }
                        }}
                        className={seatClass}
                      >
                        {seatNumber}
                      </button>
                    </li>
                  );
              });
            })}
          </ul>
        </div>
      </div>
    );
  };
  return (
    <div>
      {show && (
        <Row gutter={24}>
          <Col span={24}>
            <Card
              title={
                <div className="movie-title-details">
                  <h1>{show.movie.movieName}</h1>
                  <p>
                    Theatre: {show.theatre.name}, {show.theatre.address}
                  </p>
                </div>
              }
              extra={
                <div className="show-name py-3">
                  <h3>
                    <span>Show Name:</span> {show.name}
                  </h3>
                  <h3>
                    <span>Date & Time: </span>
                    {moment(show.date).format("MMM Do YYYY")} at
                    {moment(show.time, "HH:mm").format("hh:mm A")}
                  </h3>
                  <h3>
                    <span>Ticket Price:</span> Rs. {show.ticketPrice}/-
                  </h3>
                  <h3>
                    <span>Total Seats:</span> {show.totalSeats}
                    <span> &nbsp;|&nbsp; Available Seats:</span>
                    {show.totalSeats - show.bookedSeats.length}
                  </h3>
                </div>
              }
              style={{ width: "100%" }}
            >
              {getSeats()}

              {selectedSeats.length > 0 && (
                <Elements stripe={stripePromise}>
                  <CheckoutForm
                    show={show}
                    selectedSeats={selectedSeats}
                    user={user}
                    params={params}
                    dispatch={dispatch}
                    navigate={navigate}
                    onSuccess={() => setSelectedSeats([])}
                  />
                </Elements>
              )}
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default BookShow;
