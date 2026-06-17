import React from 'react';

function TeamFooter() {
  return (
    <footer className="team-footer">
      <h3 className="team-footer__title">Контактна інформація</h3>
      <div className="team-footer__contacts">
        <div className="team-footer__contact-item">
          <span className="team-footer__icon">📧</span>
          <span>teams@company.dev.com</span>
        </div>
        <div className="team-footer__contact-item">
          <span className="team-footer__icon"></span>
          <span>+380 (94) 123-45-67</span>
        </div>
        <div className="team-footer__contact-item">
          <span className="team-footer__icon">📍</span>
          <span>Київ, Україна</span>
        </div>
      </div>
      <p className="team-footer__copyright">
        © 2026 Dev Teams. Усі права захищені.
      </p>
    </footer>
  );
}

export default TeamFooter;
