# Be sure to restart your server when you modify this file.

# Define an application-wide content security policy.
# See the Securing Rails Applications Guide for more information:
# https://guides.rubyonrails.org/security.html#content-security-policy-header

Rails.application.configure do
  config.content_security_policy do |policy|
    policy.default_src :self
    policy.font_src    :self, :data
    policy.img_src     :self, :data
    policy.object_src  :none
    policy.script_src  :self
    policy.frame_ancestors :none
    # Radix UI / React components set style attributes at runtime.
    policy.style_src   :self, :unsafe_inline
    # ActionCable websocket (same origin).
    policy.connect_src :self

    if Rails.env.development?
      # Vite dev server: HMR websocket, module scripts, injected styles, and
      # the inline react-refresh preamble.
      vite = "http://#{ViteRuby.config.host_with_port}"
      vite_ws = "ws://#{ViteRuby.config.host_with_port}"
      policy.script_src(*policy.script_src, :unsafe_eval, :unsafe_inline, vite)
      policy.style_src(*policy.style_src, vite)
      policy.connect_src(*policy.connect_src, vite, vite_ws, "ws://localhost:3000", "ws://127.0.0.1:3000")
    end
  end
end
