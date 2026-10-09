import React from 'react';
import Layout from '../components/Layout';

export default function Directory() {
  return (
    <Layout title="Campus Directory - UAI Athletics">
      <div className="pt-8 pb-20 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <h1 className="font-headline-xl text-headline-xl text-on-surface mb-8">Campus Directory</h1>
        <div className="prose prose-invert max-w-none text-on-surface-variant font-body-lg">
          <p>Universal AI University Campus Contacts for Athletics:</p>
          <ul>
            <li><strong>Athletics Director:</strong> Dr. R. Sharma (r.sharma@uaiu.edu)</li>
            <li><strong>Head Coach (Men's Sports):</strong> Coach J. Patel (j.patel@uaiu.edu)</li>
            <li><strong>Head Coach (Women's Sports):</strong> Coach M. Singh (m.singh@uaiu.edu)</li>
            <li><strong>General Inquiries:</strong> admin@uaiu.edu</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
