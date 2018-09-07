//Core
import React from "react";
import { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Composer } from "./";

const props = {
    _createPost:         jest.fn(),
    _updateComment:      jest.fn(),
    avatar:              "avatar",
    currentUserFistName: "Anna",
};
const mocks = {
    preventDefaultMock: jest.fn(),
};
const comment = "Merry chistmas";
const initialState = {
    comment: "",
};
const updatedState = {
    comment,
};

const result = mount(<Composer { ...props } />);
const _submitCommentSpy = jest.spyOn(result.instance(), "_submitComment");
const _handleFormSubmitSpy = jest.spyOn(result.instance(), "_handleFormSubmit");

describe("Composer component:", () => {
    test('should have 1 "section" element', () => {
        expect(result.find("section")).toHaveLength(1);
    });
    test('should have 1 "form" element', () => {
        expect(result.find("form")).toHaveLength(1);
    });
    test('should have 1 "textarea" element', () => {
        expect(result.find("textarea")).toHaveLength(1);
    });
    test('should have 1 "input" element', () => {
        expect(result.find("input")).toHaveLength(1);
    });
    test('should have 1 "img" element', () => {
        expect(result.find("img")).toHaveLength(1);
    });
    test("should have valid initial state", () => {
        expect(result.state()).toEqual(initialState);
    });
    test("textarea value should be empty initiall", () => {
        expect(result.find("textarea").text()).toBe("");
    });
    test("should respond to state change property", () => {
        result.setState({
            comment,
        });
        expect(result.state()).toEqual(updatedState);
        expect(result.find("textarea").text()).toBe(comment);
        result.setState({
            comment: "",
        });
        expect(result.state()).toEqual(initialState);
        expect(result.find("textarea").text()).toBe("");
    });
    test("_submitComment should return null if comment is empty", () => {
        result.find("form").simulate("submit");
        expect(_submitCommentSpy).toHaveReturnedWith(null);
        _submitCommentSpy.mockClear();
        _handleFormSubmitSpy.mockClear();
    });
    test('should handle textarea "change" event', () => {
        result.find("textarea").simulate("change", {
            target: {
                value: comment,
            },
        });
        expect(result.find("textarea").text()).toBe(comment);
        expect(result.state()).toEqual(updatedState);
    });
    test('should handle form "submit" event', () => {
        result.find("form").simulate("submit");
        expect(result.state()).toEqual(initialState);
    });
    test("_createPost prop should be invoked once after form submission", () => {
        expect(props._createPost).toHaveBeenCalledTimes(1);
    });
    test("_submitCommentSpy and _handleFormSubmitSpy class methods should be invoked once after form is submitted", () => {
        expect(_submitCommentSpy).toHaveBeenCalledTimes(1);
        expect(_handleFormSubmitSpy).toHaveBeenCalledTimes(1);
        _submitCommentSpy.mockClear();
    });

    test('_submitOnEnter should call _submitComment after "keyPress" event', () => {
        result.find("textarea").simulate("keyPress");
        result.instance()._submitOnEnter({
            key:            "Enter",
            preventDefault: mocks.preventDefaultMock,
        });
        expect(mocks.preventDefaultMock).toHaveBeenCalledTimes(1);
        expect(_submitCommentSpy).toHaveBeenCalledTimes(1);
        _submitCommentSpy.mockClear();
    });
});
