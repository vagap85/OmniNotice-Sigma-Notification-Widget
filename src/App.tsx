import "./App.css"
import { useRef, useState } from "react";
import NotificationCardList from "./NotificationWidget/NotificationCardList/NotificationCardList";
import { NotificationCardListHandle } from "./NotificationWidget/types";
import BellRing from "./icons/BellRing";

function App() {
    const listRef = useRef<NotificationCardListHandle>(null);
    const [counter, setCounter] = useState(1)

    const showNotification = () => {
        setCounter(prev => prev+1)
        listRef.current?.add({
            title: `Новое уведомление ${counter}`,
            description: "У вас есть новое сообщение, требующее внимания.",
            buttonText: "Посмотреть",
            Icon: <BellRing />,
        });
    };

    return (
        <div>
            <button
                style={{
                    background: "blue",
                    borderRadius: "8px",
                    padding: "12px 20px",
                    color: "white",
                    marginInline: "auto",
                    display: "block",
                    border: "none",
                    marginTop : "12px",
                    cursor: "pointer"
                }}
                onClick={showNotification}>Показать уведомление</button>
            <NotificationCardList ref={listRef} maxVisible={3} />
        </div>
    );
}

export default App;