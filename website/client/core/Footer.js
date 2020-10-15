const React = require('react')

module.exports = function Footer({config}) {
  const {baseUrl, docsUrl} = config
  const docsPart = `${baseUrl}${docsUrl ? `${docsUrl}/` : ''}`
  return (
    <footer className="nav-footer" id="footer">
      <section className="sitemap">
        <a href={baseUrl} className="nav-home">
          {config.footerIcon && (
            <img src={baseUrl + config.footerIcon} alt={config.title} />
          )}
        </a>
        <div>
          <h5>Docs</h5>
          <a href={`${docsPart}introduction/installation`}>Getting Started</a>
          <a href={`${docsPart}api/effector`}>API Reference</a>
          <a href="https://changelog.effector.dev">Changelog</a>
        </div>
        <div>
          <h5>Community</h5>
          <a
            href="https://twitter.com/effectorjs"
            target="_blank"
            rel="noreferrer noopener">
            Twitter
          </a>
          <a href="tg://resolve?domain=effector_ru">Telegram 🇷🇺</a>
          <a href="tg://resolve?domain=effector_en">Telegram</a>
        </div>
        <div>
          <h5>More</h5>
          <a href="https://github.com/effector/effector">GitHub</a>
          <a
            className="github-button"
            href={config.repoUrl}
            data-icon="octicon-star"
            data-count-href="/effector/effector/stargazers"
            data-show-count="true"
            data-count-aria-label="# stargazers on GitHub"
            aria-label="Star this project on GitHub">
            Star
          </a>
        </div>
      </section>
      <section className="copyright">{config.copyright}</section>
    </footer>
  )
}
