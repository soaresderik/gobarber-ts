import * as React from "react";
import {
  NotificationContainer,
  Badge,
  NotificationList,
  Notification
} from "./styles";
import { parseISO, formatDistance } from "date-fns";
import * as pt from "date-fns/locale/pt";
import { MdNotifications } from "react-icons/md";
import Scrollbars from "react-scrollbars-custom";
import api from "../../services/auth.service";
import { INotification } from "../../services/interfaces";

const Notifications = () => {
  const [visible, setVisible] = React.useState(false);
  const [notifications, setNotifications] = React.useState<
    INotification[] | null
  >(null);

  const hasUnread = React.useMemo(
    () =>
      notifications
        ? !!notifications.find(notification => notification.read === false)
        : true,
    [notifications]
  );

  React.useEffect(() => {
    async function loadNotifications() {
      const response = await api.get("notifications");

      const data = response.data.map((notification: any) => ({
        ...notification,
        createdAt: formatDistance(
          parseISO(notification.createdAt),
          new Date(),
          { addSuffix: true, locale: pt }
        )
      }));

      setNotifications(data);
    }
    loadNotifications();
  }, []);

  function handleToggleVisible() {
    setVisible(!visible);
  }

  async function handleMarkAsRead(id: string) {
    await api.put(`notifications/${id}`);

    setNotifications(
      notifications.map(notification =>
        notification._id === id ? { ...notification, read: true } : notification
      )
    );
  }

  return (
    <NotificationContainer>
      <Badge hasUnread={hasUnread} onClick={handleToggleVisible}>
        <MdNotifications color="#7159c1" size={20} />
      </Badge>

      <NotificationList visible={!visible}>
        <Scrollbars style={{ maxHeight: 260, height: 260 }}>
          {notifications &&
            notifications.map(notification => (
              <Notification key={notification._id} unread={!notification.read}>
                <p>{notification.content}</p>
                <time>{notification.createdAt}</time>
                {!notification.read && (
                  <button
                    type="button"
                    onClick={() => handleMarkAsRead(notification._id)}
                  >
                    Marcar como lida
                  </button>
                )}
              </Notification>
            ))}
        </Scrollbars>
      </NotificationList>
    </NotificationContainer>
  );
};

export default Notifications;
