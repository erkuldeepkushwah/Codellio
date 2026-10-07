import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper to serve HTML files
const serveHtml = (file) => (req, res) => {
  res.sendFile(path.join(__dirname, 'Codellio', file));
};

// Main page routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get(['/home', '/home.html'], serveHtml('home.html'));
app.get(['/about-us', '/about-us/', '/about', '/about.html'], serveHtml('about.html'));
app.get(['/services', '/services/', '/service', '/service.html'], serveHtml('service.html'));
app.get(['/faq', '/faq/', '/faq.html'], serveHtml('faq.html'));
app.get(['/contact', '/contact/', '/contact.html'], serveHtml('contact.html'));

// Compatibility routes for any legacy /be/accountant4 paths
app.get(['/be/accountant4', '/be/accountant4/'], (req, res) => res.redirect(301, '/'));
app.get(['/be/accountant4/about-us', '/be/accountant4/about-us/'], (req, res) => res.redirect(301, '/about-us'));
app.get(['/be/accountant4/services', '/be/accountant4/services/'], (req, res) => res.redirect(301, '/services'));
app.get(['/be/accountant4/faq', '/be/accountant4/faq/'], (req, res) => res.redirect(301, '/faq'));
app.get(['/be/accountant4/contact', '/be/accountant4/contact/'], (req, res) => res.redirect(301, '/contact'));

// Contact form API mock endpoint (Contact Form 7 AJAX)
app.all([
  '/wp-json/contact-form-7/v1/contact-forms/:id/feedback',
  '/be/accountant4/wp-json/contact-form-7/v1/contact-forms/:id/feedback'
], (req, res) => {
  res.json({
    contact_form_id: req.params.id,
    status: 'mail_sent',
    message: 'Thank you for your message. It has been sent successfully.',
    posted_data_hash: '',
    into: '#wpcf7-f' + req.params.id + '-p19-o1',
    invalid_fields: []
  });
});

// Non-AJAX contact form POST handler
app.post(['/contact', '/contact/', '/be/accountant4/contact', '/be/accountant4/contact/*'], (req, res) => {
  res.redirect('/contact?success=1');
});

// Mock telemetry / analytics endpoints to return 204
app.all(['/nc6z', '/nc6z/*'], (req, res) => res.status(204).end());
app.all('/cdn-cgi/scripts/*', (req, res) => {
  res.type('application/javascript').send('/* cloudflare script stub */');
});

// Static assets
app.use('/Codellio', express.static(path.join(__dirname, 'Codellio')));
app.use(express.static(__dirname));

// Fallback to index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Codellio app listening on http://0.0.0.0:${PORT}`);
});
