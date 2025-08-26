// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

contract Test {
  uint256 public x = 125;

  event XSet(uint256 _from, uint256 _to);

  constructor(uint256 _x) {
    emit XSet(x, _x);
    x = _x;
  }

  function setX(uint256 _x) external {
    emit XSet(x, _x);
    x = _x;
  }
}
