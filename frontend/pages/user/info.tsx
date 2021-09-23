import Head from "next/head";
import React, { useState } from "react";
import { Col, Container, Form, Row, FormControl } from "react-bootstrap";
import DefaultLayout from "../../layouts/Default";
import axios from "axios";
import { useRouter } from "next/router";

export const Edit = () => {
  const router = useRouter();
  const [profile, setProfile] = useState({
    username: "",
    firstname: "",
    lastname: "",
  });
  const [required, setRequired] = useState({
    username: "",
    firstname: "",
    lastname: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setProfile((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmitClick = async (e) => {
    e.preventDefault();
    let allInfo = true;

    if (!profile.username.length) {
      setRequired((prevRequired) => ({
        ...prevRequired,
        username: "*required",
      }));
      allInfo = false;
    } else setRequired((prevRequired) => ({ ...prevRequired, username: "" }));

    if (!profile.firstname.length) {
      setRequired((prevRequired) => ({
        ...prevRequired,
        firstname: "*required",
      }));
      allInfo = false;
    } else setRequired((prevRequired) => ({ ...prevRequired, firstname: "" }));

    if (!profile.lastname.length) {
      setRequired((prevRequired) => ({
        ...prevRequired,
        lastname: "*required",
      }));
      allInfo = false;
    } else setRequired((prevRequired) => ({ ...prevRequired, lastname: "" }));

    if (!allInfo) return;
    const payload = {
      username: profile.username,
      firstname: profile.firstname,
      lastname: profile.lastname,
    };
    updateProfile(payload);
  };

  const updateProfile = (payload) => {
    axios
      .post(`http://localhost:8080/api/user`, payload)
      .then(function (response) {
        router.push("/");
      })
      .catch(function (error) {
        console.log(error);
      });
    // const instance = axios.create({
    //   baseURL: `app_backend:8080/api`,
    // });
    // instance.post("/user", payload).then(() => {
    //   router.push("/");
    // });
  };

  return (
    <DefaultLayout>
      <Head>
        <title>Edit</title>
      </Head>

      <Container className="my-4">
        <Row>
          <Col className="text-center">
            <h1>Edit Your Profile</h1>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 5 }} className="mx-auto mt-5">
            <h2>Information</h2>
            <Form>
              <fieldset>
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <FormControl
                    type="text"
                    id="username"
                    placeholder="Username"
                    value={profile.username}
                    onChange={handleChange}
                    required
                    isInvalid={!!required.username}
                  />
                  <FormControl.Feedback type="invalid">
                    {required.username}
                  </FormControl.Feedback>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Firstname</Form.Label>
                  <FormControl
                    type="text"
                    id="firstname"
                    placeholder="Firstname"
                    value={profile.firstname}
                    onChange={handleChange}
                    required
                    isInvalid={!!required.firstname}
                  />
                  <FormControl.Feedback type="invalid">
                    {required.firstname}
                  </FormControl.Feedback>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Lastname</Form.Label>
                  <FormControl
                    type="text"
                    id="lastname"
                    placeholder="Lastname"
                    value={profile.lastname}
                    onChange={handleChange}
                    isInvalid={!!required.lastname}
                  />
                  <FormControl.Feedback type="invalid">
                    {required.lastname}
                  </FormControl.Feedback>
                </Form.Group>
              </fieldset>
            </Form>
          </Col>
        </Row>
        <Row className="">
          <Col>
            <button
              type="button"
              className="float-right my-2 btn btn-success"
              onClick={handleSubmitClick}
            >
              Save
            </button>
          </Col>
          <Col>
            <button
              type="button"
              className="float-left my-2 btn btn-danger"
              onClick={() => {
                router.push("/");
              }}
            >
              Cancel
            </button>
          </Col>
        </Row>
      </Container>
    </DefaultLayout>
  );
};

export default Edit;
