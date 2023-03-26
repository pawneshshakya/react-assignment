import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { cardActions } from "_store";
import Card from "react-credit-cards";
import { StackedCarousel } from "react-stacked-carousel";
import "react-stacked-carousel/dist/index.css";

const Cards = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
//   const [cardList, setCardList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [page, setPage] = useState(1);
  const { cards: cardData, cardList } = useSelector((state) => state.cards);
  useEffect(() => {
    dispatch(cardActions.getAllCards(page));
  }, []);
  const handleClick = () => {
    navigate("/cards/new");
  };
  const onCardChange = (event) => {
    setCurrentIndex(event?.currentIndex);
    if (event.currentIndex === page * 10 - 2) {
      dispatch(cardActions.getAllCards(page + 1));
      setPage((prev) => prev + 1);
    }
  };
  return (
    <div className="main-container w-100 ">
      <button type="button" class="btn btn-secondary" onClick={handleClick}>
        add new card
      </button>
      <div className="card-stack">
        <StackedCarousel
          autoRotate={false}
          onCardChange={onCardChange}
          containerClassName={""}
          cardClassName=""
          leftButton={<button disabled={currentIndex === 0}>{"<"}</button>}
          rightButton={
            <button disabled={currentIndex === cardData?.totalResults}>
              {">"}
            </button>
          }
        >
          {cardData?.totalResults > 0 &&
            cardList?.map((card, i) => {
              return (
                <Card
                  key={i}
                  number={card?.cardNumber}
                  name={card?.cardHolder}
                  expiry={card?.cardExpiration}
                  cvc={card?.cvc}
                />
              );
            })}
        </StackedCarousel>
      </div>
    </div>
  );
};

export { Cards };
