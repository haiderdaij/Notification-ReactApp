import React, { useEffect, useState, useRef } from "react";
import {
  Group,
  Button,
  Title,
  TextInput,
  Paper,
  Avatar,
  createStyles,
} from "@mantine/core";
import {
  showNotification,
  cleanNotifications,
  updateNotification,
} from "@mantine/notifications";
import { IconCheck, IconAt, IconUser } from "@tabler/icons";
import { db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

const useStyles = createStyles((theme) => ({
  title: {
    textAlign: "center",
    fontWeight: 700,
    fontSize: 30,
    letterSpacing: 0,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    marginBottom: theme.spacing.xs,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    "@media (max-width: 520px)": {
      fontSize: 28,
      textAlign: "left",
    },
  },
}));
const DemoNotifications = () => {
  const [users, setUsers] = useState([]);
  const userCollectionRef = collection(db, "users");
  const nameRef = useRef();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const { classes } = useStyles();

  useEffect(() => {
    nameRef.current.focus();
    const fetchData = async () => {
      const res = await getDocs(userCollectionRef);
      setUsers(res.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    fetchData();
  }, []);

  const createNewUser = async () => {
    if (name === "" && email === "") {
      return;
    }
    await addDoc(userCollectionRef, { name: name, email: email });
  };

  return (
    <div>
      <TitleApp classes={classes} />
      <OneNotification showNotification={showNotification} />
      <MultiNotification
        setTimeout={setTimeout}
        showNotification={showNotification}
        cleanNotifications={cleanNotifications}
        users={users}
      />
      <UpdateNotification
        showNotification={showNotification}
        setTimeout={setTimeout}
        updateNotification={updateNotification}
        nameRef={nameRef}
        setEmail={setEmail}
        setName={setName}
        createNewUser={createNewUser}
        email={email}
        name={name}
      />
    </div>
  );
};

export default DemoNotifications;

function OneNotification({ showNotification }) {
  return (
    <Group position="left" mt={50} mb={50} mx={100}>
      <Button
        variant="outline"
        style={{
          fontSize: 25,
        }}
        onClick={() =>
          showNotification({
            icon: <Avatar radius={50} src={require("../images/me.jpg")} />,
            title: "Welcome to my demo notification system",
            message: "I'm using Mantine for the UI + Firebase for the data",
            color: "red",
            autoClose: false,
            styles: (theme) => ({
              title: {
                color: theme.colors.dark,
              },
              description: {
                color: theme.colors.dark,
              },
              closeButton: {
                color: theme.colors.dark,
              },
            }),
          })
        }
      >
        Resource
      </Button>
    </Group>
  );
}

function MultiNotification({
  setTimeout,
  showNotification,
  cleanNotifications,
  users,
}) {
  return (
    <Group position="left" mx={100}>
      <Button
        style={{
          fontSize: 23,
        }}
        variant="outline"
        onClick={() => {
          users.map((user) => {
            setTimeout(() => {
              showNotification({
                title: user.name,
                message: user.email,
              });
            }, 200 * user.id);
          });
        }}
      >
        Show all users
      </Button>
      <Button
        style={{
          fontSize: 23,
        }}
        variant="outline"
        color="red"
        onClick={cleanNotifications}
      >
        Clean all
      </Button>
    </Group>
  );
}

function UpdateNotification({
  showNotification,
  setTimeout,
  updateNotification,
  nameRef,
  setName,
  setEmail,
  createNewUser,
  email,
  name,
}) {
  return (
    <>
      <Group position="left" mx={100} my={30}>
        <Paper radius={0}>
          <TextInput
            label="Name"
            icon={<IconUser size={18} />}
            placeholder="Your name"
            size="md"
            ref={nameRef}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <TextInput
            label="E-mail"
            size="md"
            icon={<IconAt size={18} />}
            placeholder="Your email"
            my={20}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Paper>
      </Group>

      <Group position="left" mx={100}>
        <Button
          style={{
            fontSize: 22,
            opacity: (email === "") | (name === "") ? 0.4 : 1,
          }}
          variant="filled"
          onClick={() => {
            createNewUser();
            showNotification({
              id: "load-data",
              loading: true,
              title: `${name}`,
              message: `${email}`,
              autoClose: false,
              disallowClose: true,
            });
            setTimeout(() => {
              updateNotification({
                id: "load-data",
                color: "teal",
                title: "Data was loaded",
                icon: <IconCheck size={16} />,
                autoClose: 2000,
              });
            }, 3000);
          }}
        >
          Post user
        </Button>
      </Group>
    </>
  );
}

function TitleApp({ classes }) {
  return (
    <Group position="center" my={20} ml={22}>
      <Title className={classes.title}> Notification System</Title>
    </Group>
  );
}
