requirejs.config({
  paths: {
    jquery: '/js/lib/jquery',
    text: '/js/lib/require-text',
    vue: '/js/lib/vue',
  }
});

// Change default Vue template delimiters to not conflict with Jinja's
var VUE_DELIMITERS = ['${', '}'];

requirejs([
  'jquery',
  'vue',
  'text!../templates/footer.html',
  'text!../templates/main.html',
], function(
  $,
  Vue,
  footerTemplate,
  mainTemplate
) {

  /*
   * Page Footer
   */
  var today = new Date();
  Vue.component('page-footer', {
    delimiters: VUE_DELIMITERS,
    template: footerTemplate,
    data: function() {
      return {
        year: today.getFullYear(),
      }
    },
  });

  /*
   * Main View
   */
   // Input states to record which of the three input fields was last edited: Tip %, Tip Amount
   // or Total. This will be used to auto-fill the rest of the fields based on the last field
   // that was edited. For example: if user entered Price and Tip %, auto-fill Tip Amount and Total.
  var INPUT_STATE_NONE = 'none';
  var INPUT_STATE_TIP_PERCENT = 'tip-percent';
  var INPUT_STATE_TIP_AMOUNT = 'tip-amount';
  var INPUT_STATE_TOTAL = 'total';

  Vue.component('tipper', {
    delimiters: VUE_DELIMITERS,
    template: mainTemplate,
    data: function() {
      return {
        price: 0.0,
        tipPercent: 0.0,
        tipAmount: 0.0,
        totalAmount: 0.0,
        lastInputState: INPUT_STATE_NONE,
        tipPresets: [10, 15, 20, 25],
      }
    },
    methods: {
      clearInput: function(event) {
        this.price = 0.0;
        this.tipPercent = 0.0;
        this.tipAmount = 0.0;
        this.totalAmount = 0.0;
        this.lastInputState = INPUT_STATE_NONE;
      },

      isPriceEmpty: function() {
        return Number(this.price) < 0.01;
      },

      highlightPrice: function(isError) {
        var $price = $('.js-price');
        $price.removeClass('error');

        var elClass = isError ? 'error' : '';
        $price.addClass(elClass);
      },

      round: function(number) {
        return Number(number.toFixed(2));
      },

      onPriceChanged: function(event) {
        if (this.isPriceEmpty()) {
          this.highlightPrice(true);

        } else {
          this.highlightPrice(false);

          this.price = this.round(this.price);

          // Kick-off auto-fill events for when price was changed after
          // selecting one of the tip methods.
          switch(this.lastInputState) {
            case INPUT_STATE_TOTAL:
              this.onTotalChanged();
              break;
            case INPUT_STATE_TIP_AMOUNT:
              this.onTipAmountChanged();
              break;
            case INPUT_STATE_TIP_PERCENT:
              this.onTipPercentChanged();
              break;
          }
        }
      },

      onTipPercentChanged: function(event) {
        // If price wasn't entered, prompt user to enter price
        if (this.isPriceEmpty()) {
          this.highlightPrice(true);

        // Otherwise, auto-fill Tip Amount and Total based on Price and Tip %
        } else {
          this.tipAmount = this.round(this.price * (this.tipPercent / 100.0));
          this.totalAmount = this.round(this.price + this.tipAmount);
        }

        this.lastInputState = INPUT_STATE_TIP_PERCENT;
      },

      onTipAmountChanged: function(event) {
        // If price wasn't entered, prompt user to enter price
        if (this.isPriceEmpty()) {
          this.highlightPrice(true);

        // Otherwise, auto-fill Tip % and Total based on Price and Tip Amount
        } else {
          this.tipPercent = this.round(this.tipAmount * 100.0 / this.price);
          this.totalAmount = this.round(this.price + this.tipAmount);
        }

        this.lastInputState = INPUT_STATE_TIP_AMOUNT;
      },

      onTotalChanged: function(event) {
        // If price wasn't entered, prompt user to enter price
        if (this.isPriceEmpty()) {
          this.highlightPrice(true);

        // Otherwise, auto-fill Tip % and Tip Amount based on Price and Total
        } else {
          this.tipAmount = this.round(this.totalAmount - this.price);
          this.tipPercent = this.round(this.tipAmount * 100.0 / this.price);
        }

        this.lastInputState = INPUT_STATE_TOTAL;
      },
    }
  });

  /*
   * Root View
   */
  var rootView = new Vue({
    delimiters: VUE_DELIMITERS,
    el: '.js-container',
  });
});
