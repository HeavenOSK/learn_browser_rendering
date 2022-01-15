import {Selector, Value} from "@/css";
import {Dom, ElementData} from "@/dom";

type PropertyMap = Map<String, Value>

type StyledNode = {
  node: Dom,
  specifiedValues: PropertyMap,
  children: StyledNode[]
}
const matches = (elementData: ElementData, selector: Selector) => {
  //todo:後でやる
}
