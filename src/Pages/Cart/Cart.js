import React from "react";
import Nav from "../../Components/Nav/Nav";
import Footer from "../../Components/Footer/Footer";
import CartItem from "./CartItem";
import URL from "../../url";
import "./Cart.scss";

class Cart extends React.Component {
  state = {
    carts: [],
    totalPrice: "",
    isChecked: true,
    allBtnCheck: true,
    isAllChecked: [],
  };

  componentDidMount() {
    this.getCartItem();
  }

  getCartItem = () => {
    fetch(`${URL}cart`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
      .then(res => res.json())
      .then(({ carts }) => {
        let totalPrice = 0;
        let emptyArr = [];
        for (let i = 0; carts.length > i; i++) {
          totalPrice += carts[i].price * carts[i].count;
          emptyArr.push(true);
        }

        this.setState({
          carts,
          totalPrice,
          isAllChecked: emptyArr,
        });
      });
  };

  handleCheck = e => {
    let anotherArr = this.state.isAllChecked;
    anotherArr[e] = !anotherArr[e];
    this.setState(
      {
        isAllChecked: anotherArr,
        allBtnCheck: !anotherArr.includes(false),
      },
      () => this.handleTotal()
    );
  };

  handleTotal = () => {
    const { carts } = this.state;
    let checkedIdx = this.state.isAllChecked.reduce((arr, e, i) => {
      e === true && arr.push(i);
      return arr;
    }, []);
    let totalFee = 0;

    for (let i = 0; i < carts.length; i++) {
      if (checkedIdx.includes(i)) {
        totalFee += carts[i].price * carts[i].count;
      }
    }
    this.setState({
      totalPrice: totalFee,
    });
  };

  handleAllcheck = () => {
    let trueArr = [];
    for (let i = 0; i < this.state.isAllChecked.length; i++) {
      trueArr.push(true);
    }
    let falseArr = [];
    for (let i = 0; i < this.state.isAllChecked.length; i++) {
      falseArr.push(false);
    }
    this.setState(
      {
        allBtnCheck: !this.state.allBtnCheck,
        isAllChecked: this.state.allBtnCheck ? falseArr : trueArr,
      },
      () => this.handleTotal()
    );
  };

  handleDelete = (cart_id, cart_idx) => {
    fetch(`${URL}cart/${cart_id}`, {
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    const newCart = this.state.carts.filter((_, idx) => idx !== cart_idx);
    this.setState({ carts: newCart });
  };

  render() {
    const { carts, totalPrice, allBtnCheck } = this.state;
    const freeDelivery = totalPrice >= 30000;
    console.log("render launched", this.state.isAllChecked);
    return (
      <div className="Cart">
        {!carts.length ? (
          <div className="EmptyCart">
            <p className="cartHeader">장바구니</p>
            <div className="emptyBasket">
              <div className="emptyCartMessage">
                <p>아직 관심 상품이 없네요!</p>
                <p>귀여운 프렌즈 상품을 추천드릴게요</p>
              </div>
              <a
                href="https://store.kakaofriends.com/kr/index?tab=hot"
                className="linkButton"
              >
                <span className="linkMessage">인기 상품 보기</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="FilledCart">
            <div className="cartHeaderWrap">
              <p className="cartHeader">장바구니</p>
              <div className="filledCartHeader">
                <div className="subHeader">
                  <label
                    onClick={this.handleAllcheck}
                    className={`checker ${allBtnCheck ? "" : "unchecked"}`}
                  />
                  <span className="total">전체</span>
                  <span className="null">&nbsp;</span>
                  <span className="totalCount">3</span>
                </div>
                <div className="headerDelete">
                  <span className="delete">3개 선택</span>
                  <button type="button" class="deleteButton" />
                </div>
              </div>
            </div>
            <div className="filledCartWrap">
              <div className="filledCartDetail">
                <ul className="filledCartDetailHeader">
                  <li className="productName">상품명</li>
                  <li className="option">옵션</li>
                  <li className="quantity">수량</li>
                  <li className="price">상품금액</li>
                </ul>
              </div>
              {carts.map((carts, idx) => {
                return (
                  <CartItem
                    key={carts.product}
                    idx={idx}
                    carts={carts}
                    check={this.handleCheck}
                    All
                    handleDelete={this.handleDelete}
                    icon={this.state.isAllChecked[idx]}
                  />
                );
              })}
              <div className="totalPriceBox">
                <div className="totalPriceBarWrap">
                  <span className="deliveryCountry">배송국가</span>
                  <label content="한국" class="selectBox">
                    <select class="selectBoxLabel">
                      <option value="한국" selected="">
                        한국
                      </option>
                    </select>
                  </label>
                </div>
                <div className="totalPrice">
                  <div className="totalOrder">
                    <span className="totalPriceLabel">총 주문금액</span>
                    <span className="totalPriceWon">
                      {totalPrice?.toLocaleString()}원
                    </span>
                  </div>
                  <div className="deliveryFee">
                    <span class="deliveryFeeLabel">배송비</span>
                    <span className="deliveryFeeWon">
                      <span>
                        {!freeDelivery && totalPrice && "3,000원"}
                        {freeDelivery && totalPrice && "무료"}
                        {!totalPrice && "원"}
                      </span>
                    </span>
                  </div>
                  <div className="totalFee">
                    <span class="totalFeeLabel">총 결제금액</span>
                    <span className="totalFeeWon">
                      {!freeDelivery &&
                        totalPrice &&
                        (totalPrice + 3000)?.toLocaleString()}
                      {freeDelivery &&
                        totalPrice &&
                        totalPrice?.toLocaleString()}
                      {!totalPrice && ""}원
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="orderButtonWrap">
              <button className="orderButton">주문 하기</button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Cart;
