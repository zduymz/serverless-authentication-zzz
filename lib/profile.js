'use strict';
/**
 * Profile class that normalizes profile data fetched from authentication provider
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function formatAddress(address) {
  var result = address;
  if (result) {
    result.formatted = result.street_address + '\n' + result.postal_code + ' ' + result.locality + '\n' + result.country;
    return result;
  }
  return null;
}

var Profile =
/**
 * @param data {object}
 */
exports.Profile = function Profile(data) {
  _classCallCheck(this, Profile);

  var fields = ['_raw', 'address', 'at_hash', 'birthdate', 'email_verified', 'email', 'family_name', 'gender', 'given_name', 'id', 'locale', 'middle_name', 'name', 'nickname', 'phone_number_verified', 'phone_number', 'picture', 'preferred_username', 'profile', 'provider', 'sub', 'updated_at', 'website', 'zoneinfo'];
  this._raw = data;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = fields[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var field = _step.value;

      if (data.hasOwnProperty(field)) {
        var value = data[field];
        if (field === 'address') {
          this.address = formatAddress(data.address);
        } else {
          this[field] = value || null;
        }
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
};