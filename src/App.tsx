import { useState } from "react";
import "./App.css";

type Category =
  | "전체"
  | "커피"
  | "논커피"
  | "블렌디드"
  | "와플";

type MenuCategory = Exclude<Category, "전체">;

type MenuItem = {
  id: string;
  name: string;
  category: MenuCategory;
  price: number;
  image: string;
};

type CartItem = MenuItem & {
  quantity: number;
};

type MenuCardProps = {
  menu: MenuItem;
  onAdd: (menu: MenuItem) => void;
};

type CartItemProps = {
  item: CartItem;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
};

const categories: Category[] = [
  "전체",
  "커피",
  "논커피",
  "블렌디드",
  "와플",
];

const menuItems: MenuItem[] = [
  {
    id: "americano",
    name: "아메리카노",
    category: "커피",
    price: 4000,
    image: "/images/americano.png",
  },
  {
    id: "espresso",
    name: "에스프레소",
    category: "커피",
    price: 3500,
    image: "/images/espresso.png",
  },
  {
    id: "cafe-latte",
    name: "카페라떼",
    category: "커피",
    price: 5000,
    image: "/images/cafe-latte.png",
  },
  {
    id: "chocolate-latte",
    name: "초코라떼",
    category: "논커피",
    price: 5500,
    image: "/images/chocolate-latte.png",
  },
  {
    id: "strawberry-latte",
    name: "딸기라떼",
    category: "논커피",
    price: 6000,
    image: "/images/strawberry-latte.png",
  },
  {
    id: "mint-chocolate-latte",
    name: "민트초코라떼",
    category: "논커피",
    price: 5500,
    image: "/images/mint-chocolate-latte.png",
  },
  {
    id: "java-chip-frappe",
    name: "자바칩 프라페",
    category: "블렌디드",
    price: 6500,
    image: "/images/java-chip-frappe.png",
  },
  {
    id: "blueberry-smoothie",
    name: "블루베리 스무디",
    category: "블렌디드",
    price: 6000,
    image: "/images/blueberry-smoothie.png",
  },
  {
    id: "strawberry-smoothie",
    name: "딸기 스무디",
    category: "블렌디드",
    price: 6000,
    image: "/images/strawberry-smoothie.png",
  },
  {
    id: "apple-waffle",
    name: "사과와플",
    category: "와플",
    price: 5500,
    image: "/images/apple-waffle.png",
  },
  {
    id: "strawberry-waffle",
    name: "딸기와플",
    category: "와플",
    price: 6000,
    image: "/images/strawberry-waffle.png",
  },
  {
    id: "chocolate-chip-waffle",
    name: "초코칩와플",
    category: "와플",
    price: 6000,
    image: "/images/chocolate-chip-waffle.png",
  },
];

function formatPrice(price: number) {
  return price.toLocaleString("ko-KR");
}

function MenuCard({ menu, onAdd }: MenuCardProps) {
  return (
    <button
      className="menu-card"
      type="button"
      onClick={() => onAdd(menu)}
    >
      <img src={menu.image} alt={menu.name} />

      <span className="menu-information">
        <span className="menu-name">{menu.name}</span>

        <span className="menu-price">
          {formatPrice(menu.price)}원
        </span>
      </span>
    </button>
  );
}

function CartItemCard({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {
  return (
    <div className="cart-item">
      <div>
        <strong>{item.name}</strong>

        <p className="cart-item-price">
          {formatPrice(item.price)}원
        </p>
      </div>

      <div className="quantity-control">
        <button
          type="button"
          onClick={() => onDecrease(item.id)}
          aria-label={`${item.name} 수량 줄이기`}
        >
          −
        </button>

        <span>{item.quantity}</span>

        <button
          type="button"
          onClick={() => onIncrease(item.id)}
          aria-label={`${item.name} 수량 늘리기`}
        >
          +
        </button>
      </div>

      <button
        className="remove-button"
        type="button"
        onClick={() => onRemove(item.id)}
      >
        삭제
      </button>
    </div>
  );
}

function App() {
  const [selectedCategory, setSelectedCategory] =
    useState<Category>("전체");

  const [cart, setCart] = useState<CartItem[]>([]);

  const visibleMenus =
    selectedCategory === "전체"
      ? menuItems
      : menuItems.filter(
          (menu) => menu.category === selectedCategory,
        );

  const totalPrice = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0,
  );

  const totalQuantity = cart.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  function addToCart(selectedMenu: MenuItem) {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === selectedMenu.id,
      );

      if (existingItem) {
        return currentCart.map((item) => {
          if (item.id === selectedMenu.id) {
            return {
              ...item,
              quantity: item.quantity + 1,
            };
          }

          return item;
        });
      }

      return [
        ...currentCart,
        {
          ...selectedMenu,
          quantity: 1,
        },
      ];
    });
  }

  function changeQuantity(
    menuId: string,
    amount: number,
  ) {
    setCart((currentCart) =>
      currentCart
        .map((item) => {
          if (item.id === menuId) {
            return {
              ...item,
              quantity: item.quantity + amount,
            };
          }

          return item;
        })
        .filter((item) => item.quantity > 0),
    );
  }

  function removeFromCart(menuId: string) {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.id !== menuId,
      ),
    );
  }

  function orderMenus() {
    window.alert(
      `주문이 완료되었습니다.\n총 결제 금액: ${formatPrice(totalPrice)}원`,
    );

    setCart([]);
  }

  return (
    <>
      <header className="page-header">
        <h1>우림 카페</h1>
        <p>원하는 메뉴 카드를 눌러 주문해 주세요.</p>
      </header>

      <main className="page-content">
        <h2 className="main-title">메뉴</h2>

        <nav
          className="category-tabs"
          aria-label="메뉴 카테고리"
        >
          {categories.map((category) => {
            const isSelected =
              selectedCategory === category;

            return (
              <button
                key={category}
                className={
                  isSelected
                    ? "category-tab selected"
                    : "category-tab"
                }
                type="button"
                aria-pressed={isSelected}
                onClick={() =>
                  setSelectedCategory(category)
                }
              >
                {category}
              </button>
            );
          })}
        </nav>

        <section className="menu-section">
          <div className="section-heading">
            <h2>
              {selectedCategory === "전체"
                ? "전체 메뉴"
                : selectedCategory}
            </h2>

            <span>{visibleMenus.length}개</span>
          </div>

          <div className="menu-grid">
            {visibleMenus.map((menu) => (
              <MenuCard
                key={menu.id}
                menu={menu}
                onAdd={addToCart}
              />
            ))}
          </div>
        </section>

        <section className="cart">
          <div className="cart-heading">
            <h2>장바구니</h2>
            <span>{totalQuantity}개</span>
          </div>

          {cart.length === 0 ? (
            <p className="empty-cart">
              아직 담은 메뉴가 없습니다.
            </p>
          ) : (
            <div>
              {cart.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onIncrease={(id) =>
                    changeQuantity(id, 1)
                  }
                  onDecrease={(id) =>
                    changeQuantity(id, -1)
                  }
                  onRemove={removeFromCart}
                />
              ))}
            </div>
          )}

          <p className="total-price">
            총 주문 금액: {formatPrice(totalPrice)}원
          </p>

          <button
            className="order-button"
            type="button"
            disabled={cart.length === 0}
            onClick={orderMenus}
          >
            주문하기
          </button>
        </section>
      </main>
    </>
  );
}

export default App;