import { useQRCode } from "next-qrcode"
import Page from "../../layouts/Page"
import Panel from "../../layouts/Panel"
import { useAuthentication } from "../../middleware/hooks/useAuthentication";
import './item-sale-process.scss';

const ItemSaleProcess: React.FC = () => {
  const { Image } = useQRCode();
  const { user } = useAuthentication();

  return (
    <Page>
      <Panel title="The Sale Process" displayBackNavigation>
        {/* {user && (
          <div className="ss">
            <Image
              text={`http://192.168.0.4:3001/users/${user.id}/inspect`}
              options={{
                // scale: 0.5,
                width: window.innerWidth,
                margin: 0,
                color: {
                  dark: '#ffffffff',
                  light: '#00000000',
                },
              }}
            />
          </div>
        )} */}
        <div>
          <div>

          </div>
          <div>
            <h2>Visit our Drop Point</h2>
            <p>Start by visiting our exclusive Drop Point, conveniently located at [Real address of Blakvel's warehouse or office]. No appointment is necessary; simply drop by during our working hours to begin the sale process.</p>
          </div>
        </div>
        <div>
          <div>
            <h2>Login or Register</h2>
            <p>Upon arrival, our friendly staff will guide you through the process. If you already have a Blakvel account, simply log in. If you don't have an account yet, our team will assist you in creating one. It's a quick and easy process that will unlock additional benefits and a personalized experience throughout your Blakvel journey.
To access your unique account QR code, you have multiple options:
Click the hamburger navigation at the page navbar and select "Get account QR code" from the drop-down menu.
Click your profile picture on the drop-down menu and navigate to your profile page, where you'll find a link to your QR code.
Alternatively, you can directly access your QR code by clicking here.</p>
          </div>
        </div>
        <div>
          <div>
            <h2>Unique Account QR Code</h2>
            <p>Once you have logged in or registered, you can obtain your unique account QR code using one of the methods described above or by clicking the direct link provided. This code serves as a convenient and secure way to identify your items and maintain communication with our team regarding their evaluation.</p>
          </div>
        </div>
        <div>
          <div>
            <h2>Selection and Acceptance</h2>
            <p>With your unique account QR code, present the items you wish to sell to our staff for acceptance and further inspection. They will assist you throughout the process and ensure your items are properly recorded.</p>
          </div>
        </div>
        <div>
          <div>
            <h2>Expert Evaluation</h2>
            <p>Our experienced team will carefully assess your items, taking factors such as condition, authenticity, and adherence to our guidelines into account. Rest assured, your pieces will be evaluated with expertise and precision.</p>
          </div>
        </div>
        <div>
          <div>
            <h2>Timely Response</h2>
            <p>Within a few working days, you will receive a response from the Blakvel team regarding the evaluation of your items. We understand the anticipation and aim to provide a prompt and detailed update on the status of your sale.</p>
          </div>
        </div>
        <div>
          <div>
            <h2>Success and Placement</h2>
            <p>If your items meet our condition requirements and pass our evaluation process, we will notify you that they have successfully cleared all necessary checks. Congratulations! Your items will be showcased in our prestigious Blakvel catalog, ensuring maximum exposure to potential buyers. Additionally, you will find them listed in your account under the "Sales" section.</p>
          </div>
        </div>
        <div>
          <div>
            <h2>Failure and Return</h2>
            <p>In the event that any of your items do not meet our condition requirements, we will communicate this to you. Our team will provide a detailed explanation of the reasons for the decision. You will be requested to collect the items that did not pass the requirements from our warehouse.</p>
          </div>
        </div>
        <p>Please note that our dedicated customer support team is available throughout the entire sale process to provide guidance and address any questions or concerns you may have. We value your trust and are committed to ensuring a seamless and secure transaction when selling your fashion items.</p>
        <p>Embark on the Blakvel sale process today and experience a transparent and rewarding journey. For the most up-to-date information or any further assistance, please refer to our website or reach out to our customer support team.</p>
      </Panel>
    </Page>
  )
}

export default ItemSaleProcess;