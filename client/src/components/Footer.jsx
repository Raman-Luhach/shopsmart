function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div>
                        <div className="footer-brand">🛍 ShopSmart</div>
                        <p className="footer-tagline">
                            Your one-stop destination for curated quality products at great prices.
                        </p>
                    </div>
                    <div>
                        <div className="footer-heading">Shop</div>
                        <ul className="footer-links">
                            <li>Electronics</li>
                            <li>Fashion</li>
                            <li>Home & Kitchen</li>
                            <li>Books</li>
                            <li>Sports</li>
                        </ul>
                    </div>
                    <div>
                        <div className="footer-heading">Company</div>
                        <ul className="footer-links">
                            <li>About Us</li>
                            <li>Privacy Policy</li>
                            <li>Terms of Service</li>
                            <li>Contact</li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <span>© {new Date().getFullYear()} ShopSmart. All rights reserved.</span>
                    <span>Built with ❤ using React</span>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
