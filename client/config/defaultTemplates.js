'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * The default view templates for the services and scenes. The view templates are organized according to the `Module.name` property.
 *
 * These view template are internally parsed using `lodash.template`, see [https://lodash.com/docs#template](https://lodash.com/docs#template) for more information.
 *
 * @type {Object}
 */
var defaultViewTemplates = {
  'service:checkin': '\n    <% if (label) { %>\n      <div class="section-top flex-middle">\n        <p class="big"><%= labelPrefix %></p>\n      </div>\n      <div class="section-center flex-center">\n        <div class="checkin-label">\n          <p class="huge bold"><%= label %></p></div>\n      </div>\n      <div class="section-bottom flex-middle">\n        <p class="small"><%= labelPostfix %></p>\n      </div>\n    <% } else { %>\n      <div class="section-top"></div>\n      <div class="section-center flex-center">\n        <p><%= error ? errorMessage : wait %></p>\n      </div>\n      <div class="section-bottom"></div>\n    <% } %>\n  ',

  'service:control': '\n    <h1 class="big"><%= title %></h1>\n  ',

  'service:loader': '\n    <div class="section-top flex-middle">\n      <p><%= loading %></p>\n    </div>\n    <div class="section-center flex-center">\n      <% if (showProgress) { %>\n      <div class="progress-wrap">\n        <div class="progress-bar"></div>\n      </div>\n      <% } %>\n    </div>\n    <div class="section-bottom"></div>\n  ',

  'service:locator': '\n    <div class="section-square"></div>\n    <div class="section-float flex-middle">\n      <% if (!showBtn) { %>\n        <p class="small"><%= instructions %></p>\n      <% } else { %>\n        <button class="btn"><%= send %></button>\n      <% } %>\n    </div>\n  ',

  'service:placer': '\n    <div class="section-square<%= mode === \'list\' ? \' flex-middle\' : \'\' %>">\n      <% if (rejected) { %>\n      <div class="fit-container flex-middle"><p><%= reject %></p></div>\n      <% } %>\n    </div>\n    <div class="section-float flex-middle">\n      <% if (!rejected) { %>\n        <% if (mode === \'graphic\') { %>\n          <p><%= instructions %></p>\n        <% } else if (mode === \'list\') { %>\n          <% if (showBtn) { %>\n            <button class="btn"><%= send %></button>\n          <% } %>\n        <% } %>\n      <% } %>\n    </div>\n  ',

  'service:platform': '\n    <div class="section-top"></div>\n    <div class="section-center flex-center">\n      <p><%= errorMessage %></p>\n    </div>\n    <div class="section-bottom"></div>\n  ',

  'service:sync': '\n    <div class="section-top"></div>\n    <div class="section-center flex-center">\n      <p class="soft-blink"><%= wait %></p>\n    </div>\n    <div class="section-bottom"></div>\n  ',

  'service:welcome': '\n    <div class="section-top flex-middle"></div>\n    <div class="section-center flex-center">\n        <p class="big">\n          <%= welcome %>\n          <br />\n          <b><%= globals.appName %></b>\n        </p>\n    </div>\n    <div class="section-bottom flex-middle">\n      <p class="small soft-blink"><%= touchScreen %></p>\n    </div>\n  ',

  survey: '\n    <div class="section-top">\n      <% if (counter <= length) { %>\n        <p class="counter"><%= counter %> / <%= length %></p>\n      <% } %>\n    </div>\n    <% if (counter > length) { %>\n      <div class="section-center flex-center">\n        <p class="big"><%= thanks %></p>\n      </div>\n    <% } else { %>\n      <div class="section-center"></div>\n    <% } %>\n    <div class="section-bottom flex-middle">\n      <% if (counter < length) { %>\n        <button class="btn"><%= next %></button>\n      <% } else if (counter === length) { %>\n        <button class="btn"><%= validate %></button>\n      <% } %>\n    </div>\n  '
};

exports.default = defaultViewTemplates;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlZmF1bHRUZW1wbGF0ZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBT0EsSUFBTSx1QkFBdUI7QUFDM0IsMG9CQUQyQjs7QUFzQjNCLGtFQXRCMkI7O0FBMEIzQiwyVkExQjJCOztBQXdDM0Isa1NBeEMyQjs7QUFtRDNCLCtrQkFuRDJCOztBQXNFM0IscU1BdEUyQjs7QUE4RTNCLDRNQTlFMkI7O0FBc0YzQixzWEF0RjJCOztBQW9HM0IseW9CQXBHMkI7Q0FBdkI7O2tCQTJIUyIsImZpbGUiOiJkZWZhdWx0VGVtcGxhdGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGUgZGVmYXVsdCB2aWV3IHRlbXBsYXRlcyBmb3IgdGhlIHNlcnZpY2VzIGFuZCBzY2VuZXMuIFRoZSB2aWV3IHRlbXBsYXRlcyBhcmUgb3JnYW5pemVkIGFjY29yZGluZyB0byB0aGUgYE1vZHVsZS5uYW1lYCBwcm9wZXJ0eS5cbiAqXG4gKiBUaGVzZSB2aWV3IHRlbXBsYXRlIGFyZSBpbnRlcm5hbGx5IHBhcnNlZCB1c2luZyBgbG9kYXNoLnRlbXBsYXRlYCwgc2VlIFtodHRwczovL2xvZGFzaC5jb20vZG9jcyN0ZW1wbGF0ZV0oaHR0cHM6Ly9sb2Rhc2guY29tL2RvY3MjdGVtcGxhdGUpIGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICpcbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbmNvbnN0IGRlZmF1bHRWaWV3VGVtcGxhdGVzID0ge1xuICAnc2VydmljZTpjaGVja2luJzogYFxuICAgIDwlIGlmIChsYWJlbCkgeyAlPlxuICAgICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tdG9wIGZsZXgtbWlkZGxlXCI+XG4gICAgICAgIDxwIGNsYXNzPVwiYmlnXCI+PCU9IGxhYmVsUHJlZml4ICU+PC9wPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1jZW50ZXIgZmxleC1jZW50ZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNoZWNraW4tbGFiZWxcIj5cbiAgICAgICAgICA8cCBjbGFzcz1cImh1Z2UgYm9sZFwiPjwlPSBsYWJlbCAlPjwvcD48L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tYm90dG9tIGZsZXgtbWlkZGxlXCI+XG4gICAgICAgIDxwIGNsYXNzPVwic21hbGxcIj48JT0gbGFiZWxQb3N0Zml4ICU+PC9wPlxuICAgICAgPC9kaXY+XG4gICAgPCUgfSBlbHNlIHsgJT5cbiAgICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLXRvcFwiPjwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tY2VudGVyIGZsZXgtY2VudGVyXCI+XG4gICAgICAgIDxwPjwlPSBlcnJvciA/IGVycm9yTWVzc2FnZSA6IHdhaXQgJT48L3A+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWJvdHRvbVwiPjwvZGl2PlxuICAgIDwlIH0gJT5cbiAgYCxcblxuICAnc2VydmljZTpjb250cm9sJzogYFxuICAgIDxoMSBjbGFzcz1cImJpZ1wiPjwlPSB0aXRsZSAlPjwvaDE+XG4gIGAsXG5cbiAgJ3NlcnZpY2U6bG9hZGVyJzogYFxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLXRvcCBmbGV4LW1pZGRsZVwiPlxuICAgICAgPHA+PCU9IGxvYWRpbmcgJT48L3A+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tY2VudGVyIGZsZXgtY2VudGVyXCI+XG4gICAgICA8JSBpZiAoc2hvd1Byb2dyZXNzKSB7ICU+XG4gICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3Mtd3JhcFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtYmFyXCI+PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDwlIH0gJT5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1ib3R0b21cIj48L2Rpdj5cbiAgYCxcblxuICAnc2VydmljZTpsb2NhdG9yJzogYFxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLXNxdWFyZVwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWZsb2F0IGZsZXgtbWlkZGxlXCI+XG4gICAgICA8JSBpZiAoIXNob3dCdG4pIHsgJT5cbiAgICAgICAgPHAgY2xhc3M9XCJzbWFsbFwiPjwlPSBpbnN0cnVjdGlvbnMgJT48L3A+XG4gICAgICA8JSB9IGVsc2UgeyAlPlxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuXCI+PCU9IHNlbmQgJT48L2J1dHRvbj5cbiAgICAgIDwlIH0gJT5cbiAgICA8L2Rpdj5cbiAgYCxcblxuICAnc2VydmljZTpwbGFjZXInOiBgXG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tc3F1YXJlPCU9IG1vZGUgPT09ICdsaXN0JyA/ICcgZmxleC1taWRkbGUnIDogJycgJT5cIj5cbiAgICAgIDwlIGlmIChyZWplY3RlZCkgeyAlPlxuICAgICAgPGRpdiBjbGFzcz1cImZpdC1jb250YWluZXIgZmxleC1taWRkbGVcIj48cD48JT0gcmVqZWN0ICU+PC9wPjwvZGl2PlxuICAgICAgPCUgfSAlPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWZsb2F0IGZsZXgtbWlkZGxlXCI+XG4gICAgICA8JSBpZiAoIXJlamVjdGVkKSB7ICU+XG4gICAgICAgIDwlIGlmIChtb2RlID09PSAnZ3JhcGhpYycpIHsgJT5cbiAgICAgICAgICA8cD48JT0gaW5zdHJ1Y3Rpb25zICU+PC9wPlxuICAgICAgICA8JSB9IGVsc2UgaWYgKG1vZGUgPT09ICdsaXN0JykgeyAlPlxuICAgICAgICAgIDwlIGlmIChzaG93QnRuKSB7ICU+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuXCI+PCU9IHNlbmQgJT48L2J1dHRvbj5cbiAgICAgICAgICA8JSB9ICU+XG4gICAgICAgIDwlIH0gJT5cbiAgICAgIDwlIH0gJT5cbiAgICA8L2Rpdj5cbiAgYCxcblxuICAnc2VydmljZTpwbGF0Zm9ybSc6IGBcbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi10b3BcIj48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1jZW50ZXIgZmxleC1jZW50ZXJcIj5cbiAgICAgIDxwPjwlPSBlcnJvck1lc3NhZ2UgJT48L3A+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tYm90dG9tXCI+PC9kaXY+XG4gIGAsXG5cbiAgJ3NlcnZpY2U6c3luYyc6IGBcbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi10b3BcIj48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1jZW50ZXIgZmxleC1jZW50ZXJcIj5cbiAgICAgIDxwIGNsYXNzPVwic29mdC1ibGlua1wiPjwlPSB3YWl0ICU+PC9wPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWJvdHRvbVwiPjwvZGl2PlxuICBgLFxuXG4gICdzZXJ2aWNlOndlbGNvbWUnOiBgXG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tdG9wIGZsZXgtbWlkZGxlXCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tY2VudGVyIGZsZXgtY2VudGVyXCI+XG4gICAgICAgIDxwIGNsYXNzPVwiYmlnXCI+XG4gICAgICAgICAgPCU9IHdlbGNvbWUgJT5cbiAgICAgICAgICA8YnIgLz5cbiAgICAgICAgICA8Yj48JT0gZ2xvYmFscy5hcHBOYW1lICU+PC9iPlxuICAgICAgICA8L3A+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tYm90dG9tIGZsZXgtbWlkZGxlXCI+XG4gICAgICA8cCBjbGFzcz1cInNtYWxsIHNvZnQtYmxpbmtcIj48JT0gdG91Y2hTY3JlZW4gJT48L3A+XG4gICAgPC9kaXY+XG4gIGAsXG5cbiAgc3VydmV5OiBgXG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tdG9wXCI+XG4gICAgICA8JSBpZiAoY291bnRlciA8PSBsZW5ndGgpIHsgJT5cbiAgICAgICAgPHAgY2xhc3M9XCJjb3VudGVyXCI+PCU9IGNvdW50ZXIgJT4gLyA8JT0gbGVuZ3RoICU+PC9wPlxuICAgICAgPCUgfSAlPlxuICAgIDwvZGl2PlxuICAgIDwlIGlmIChjb3VudGVyID4gbGVuZ3RoKSB7ICU+XG4gICAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1jZW50ZXIgZmxleC1jZW50ZXJcIj5cbiAgICAgICAgPHAgY2xhc3M9XCJiaWdcIj48JT0gdGhhbmtzICU+PC9wPlxuICAgICAgPC9kaXY+XG4gICAgPCUgfSBlbHNlIHsgJT5cbiAgICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWNlbnRlclwiPjwvZGl2PlxuICAgIDwlIH0gJT5cbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1ib3R0b20gZmxleC1taWRkbGVcIj5cbiAgICAgIDwlIGlmIChjb3VudGVyIDwgbGVuZ3RoKSB7ICU+XG4gICAgICAgIDxidXR0b24gY2xhc3M9XCJidG5cIj48JT0gbmV4dCAlPjwvYnV0dG9uPlxuICAgICAgPCUgfSBlbHNlIGlmIChjb3VudGVyID09PSBsZW5ndGgpIHsgJT5cbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0blwiPjwlPSB2YWxpZGF0ZSAlPjwvYnV0dG9uPlxuICAgICAgPCUgfSAlPlxuICAgIDwvZGl2PlxuICBgLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmYXVsdFZpZXdUZW1wbGF0ZXM7XG4iXX0=