import * as React from "react"

function Coockies(props) {
  return (
    <div className="cookies-popup bg-gray-900 text-white py-4 z-50">
  <div className="cookies-popup_wrapper container mx-auto px-4">
    <div className="cookies-popup_row flex items-center justify-between">
      <p className="cookies-popup_text">
        Want some Cookies?
        <span className="block">
          Cookies improve your experience on our site.
        </span>
        <a
          href="https://coinstats.app/cookiepolicy.html"
          aria-label="Read more here."
          className="text-blue-500 hover:underline"
        >
          Read more here.
        </a>
      </p>
      <div className="cookies-popup_buttons flex items-center">
        <button
          type="button"
          title=""
          className="cs-button cs-secondary-bordered-button bg-gray-700 text-white rounded-lg px-4 py-2 mr-2"
        >
          Administrar
        </button>
        <button
          type="button"
          title=""
          className="cs-button cs-primary-button bg-blue-500 text-white rounded-lg px-4 py-2"
        >
          Accept
        </button>
      </div>
    </div>
  </div>
</div>

  )
}

export default Coockies
