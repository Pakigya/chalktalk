"use strict";

(function() {
   // Chalktalk-specific type defintions go in this file.

   // This type is meant to allow a degree of interoperability for sketches that have not been
   // converted to use Atypical types yet. It's just a dumb wrapper around a JS variable, and while
   // other types can be converted to it, it can't be converted to any type (as it effectively
   // erases any type information).
   AT.defineType({
      typename: "Unknown",
      init: function(value) {
         this._def("value", value);
      },
      toPrimitive: function() {
         return this.value;
      }
   });
   AT.defineConversion(AT.Float, AT.Unknown, function(f) {
      return new AT.Unknown(f.toPrimitive());
   });
   AT.defineConversion(AT.Vector3, AT.Unknown, function(vec) {
      return new AT.Unknown([vec.x, vec.y, vec.z]);
   });
   AT.defineConversion(AT.Bool, AT.Unknown, function(b) {
      return new AT.Unknown(b.toPrimitive());
   });
   AT.defineConversion(AT.String, AT.Unknown, function(s) {
      return new AT.Unknown(s.toPrimitive());
   });

   // Type defining an angle in radians, wrapped to interval between -PI and PI,
   // freely convertible to Float
   AT.defineType({
      typename: "Radians",
      init: function(theta) {
         let mod = function (x, base) {
            // Implements a modulo operator that keeps the result positive, e.g. mod(-0.7, 1) = 0.3
            return ((x % base) + base) % base;
         }
         let wrap = function(x, low, high) {
            // Keeps a value between low and high limits, wrapping when it goes over
            // e.g. wrap(1.1, -1, 1) = -0.9
            return mod(x - low, high - low) + low;
         }
         this._def("theta", wrap(theta, -Math.PI, Math.PI));
      },
      toPrimitive: function() {
         return this.theta;
      }
   });
   AT.defineConversion(AT.Radians, AT.Float, function(ang) {
      return new AT.Float(ang.theta);
   });
   AT.defineConversion(AT.Float, AT.Radians, function(f) {
      return new AT.Radians(f.value); // Constructor takes care of wrapping
   });
   AT.defineConversionsViaIntermediary(AT.String, AT.Float, AT.Radians);
   AT.defineConversion(AT.Radians, AT.String, function(ang) {
      return new AT.String(ang.theta.toFixed(2) + " rad");
   });
   AT.defineConversionsViaIntermediary(AT.Int, AT.Float, AT.Radians);
   AT.defineConversionsViaIntermediary(AT.Radians, AT.Float, AT.Int);

   AT.defineConversionsViaIntermediary(AT.Radians, AT.Float, AT.Unknown);
})();