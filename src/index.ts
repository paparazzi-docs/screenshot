import puppeteer, {PuppeteerLaunchOptions} from "puppeteer";

type PaparazziDocsConfig = {
  apiKey: string;
  project_id: string;
}

type ViewPort = {
  width: number;
  height: number;
}

class PaparazziDocs {
  config: PaparazziDocsConfig;
  defaultViewPort: ViewPort = {width: 1280, height: 720};

  constructor(config: PaparazziDocsConfig, defaultViewPort?: ViewPort) {
    this.config = config;
    if (defaultViewPort) this.defaultViewPort = defaultViewPort;
  }

  launch(options?: PuppeteerLaunchOptions){
    return puppeteer.launch({...options, headless: "new"});
  }

  async uploadScreenshot(screenshotBuffer: Buffer, fileName: string, options = {}): Promise<Response> {
    const apiUrl = `https://api.paparazzidocs.com/v1`
    return fetch(`${apiUrl}/screenshot_ci/create`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.apiKey
        },
        body: JSON.stringify({
          project_id: this.config.project_id,
          file_name: fileName,
          image: screenshotBuffer.toString('base64'),
          release_version: '0',
          description: 'Description test',
        })
      });
  }

  async captureAndUploadScreenshot(url: string, fileName: string, options = {}): Promise<Response> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setViewport(this.defaultViewPort);

    await page.goto(url, {waitUntil: 'networkidle2'});

    const screenshotBuffer = await page.screenshot(options);
    await browser.close()
    return this.uploadScreenshot(screenshotBuffer, fileName);
  }
}
export default PaparazziDocs;