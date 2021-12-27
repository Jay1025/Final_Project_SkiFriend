import React from "react";
import styled from "styled-components";
import Text from "./Text";

const Input = (props) => {
  const {
    label,
    placeholder,
    _onChange,
    type,
    margin,
    height,
    width,
    padding,
    _value,
    _onBlur,
    _name,
    inline,
    title,
    textarea,
    signup,
    profile,
  } = props;

  const style = {
    inline,
  };

  if (title) {
    return <Title placeholder={placeholder} onChange={_onChange}></Title>;
  }
  if (textarea) {
    return <Textarea placeholder={placeholder} onChange={_onChange}></Textarea>;
  }
  if (signup) {
    return (
      <React.Fragment>
        <Text margin="0">{label}</Text>
        <SignupInput
          type={type}
          placeholder={placeholder}
          onChange={_onChange}
          value={_value}
          onBlur={_onBlur}
          name={_name}
        ></SignupInput>
      </React.Fragment>
    );
  }
  if (profile) {
    return (
      <React.Fragment>
        {label ? (
          <Text margin="0" size="13px" {...style}>
            {label}
          </Text>
        ) : (
          ""
        )}
        <ProfileInput width={width} />
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <Text>{label}</Text>
      <ElInput
        placeholder={placeholder}
        onChange={_onChange}
        type={type}
        id={type}
        margin={margin}
        width={width}
        height={height}
        value={_value}
        padding={padding}
        onBlur={_onBlur}
        name={_name}
      />
    </React.Fragment>
  );
};

Input.defaultProps = {
  width: "100%",
};

const ElInput = styled.input`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  padding: ${(props) => props.padding};
  box-sizing: border-box;
  margin: ${(props) => props.margin};
`;

const Title = styled.input`
  width: 80%;
  border: none;
  border-bottom: 1px solid black;
  &:focus {
    outline: none;
  }
`;
const Textarea = styled.textarea`
  width: 90%;
  height: 400px;
  max-width: 400px;
  padding: 10px;
  border: none;
  &:focus {
    outline: none;
    resize: none;
  }
`;

const SignupInput = styled.input`
  width: 70%;
  margin-bottom: 10px;
`;

const ProfileInput = styled.input`
  width: ${(props) => (props.width ? props.width : "")};
  height: 17px;
`;
export default Input;