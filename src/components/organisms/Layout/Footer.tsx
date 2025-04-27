import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation(); // Hook để sử dụng i18next

  return (
    <footer className="bg-primary text-white py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Logo and Description */}
        <div className="flex flex-col items-center lg:items-start">
          <h3 className="text-xl font-bold mb-4">{t('footerTitle')}</h3>
          <p className="text-gray-200 mb-4 text-center lg:text-left">
            {t('footerDescription')}
          </p>
          <p className="text-gray-400">
            © {new Date().getFullYear()} {t('footerCopyright')}
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col items-center lg:items-start">
          <h4 className="text-lg font-semibold mb-4">{t('quickLinksTitle')}</h4>
          <ul className="space-y-2 text-center lg:text-left">
            <li><a href="#" className="hover:text-gray-300">{t('quickLinkHome')}</a></li>
            <li><a href="#" className="hover:text-gray-300">{t('quickLinkAbout')}</a></li>
            <li><a href="#" className="hover:text-gray-300">{t('quickLinkServices')}</a></li>
            <li><a href="#" className="hover:text-gray-300">{t('quickLinkContact')}</a></li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="flex flex-col items-center lg:items-start">
          <h4 className="text-lg font-semibold mb-4">{t('contactUsTitle')}</h4>
          <p className="mb-2">{t('contactAddress')}</p>
          <p className="mb-2">{t('contactPhone')}</p>
          <p className="mb-6">{t('contactEmail')}</p>

          <h4 className="text-lg font-semibold mb-4">{t('followUsTitle')}</h4>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-gray-300">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="hover:text-gray-300">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="hover:text-gray-300">
              <i className="fab fa-twitter"></i>
            </a>
          </div>
        </div>

        {/* Terms and Policies */}
        <div className="flex flex-col items-center lg:items-start mt-6 lg:mt-0">
          <p className="text-white font-extrabold text-center lg:text-left">
            <a href="/terms" className="hover:text-gray-300">{t('termsAndPolicies')}</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
